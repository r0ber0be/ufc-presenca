import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { generateToken } from '../utils/QRCodeToken'
import verifyTeacherOwnsClass from '../hooks/verifyProfessorOwnsClass'

export async function turmaRoutes(app: FastifyInstance) {
  // Buscar turmas de um professor (classes)
  app.get('/turmas', async (req, res) => {
    try {
      const { sub } = await req.jwtVerify<{ sub: string }>()

      const professorTurmas = await prisma.teacher.findFirst({
        where: { uid: sub },
        include: {
          classes: {
            select: {
              id: true,
              name: true,
              code: true,
              classBlock: true,
              classRoom: true,
              schedules: {
                select: {
                  startTime: true,
                  endTime: true,
                  weekDay: true,
                },
              },
              _count: {
                select: {
                  enrollments: true,
                },
              },
            },
          },
        },
      })

      if (!professorTurmas) {
        return res.status(401).send({ message: 'Não identificado no sistema' })
      }

      const { classes } = professorTurmas

      if (classes.length === 0) {
        return res.status(404).send({ message: 'Nenhuma turma encontrada' })
      }

      return res.status(200).send(classes)
    } catch (error) {
      console.log('Erro ao buscar turmas do professor:', error)
      return res.status(500).send({ message: 'Erro interno do servidor' })
    }
  })

  // Criar nova aula (lesson)
  app.post<{
    Params: { turmaId: string }
    Body: { latitude: number; longitude: number }
  }>(
    '/:turmaId/aula',
    { preHandler: verifyTeacherOwnsClass },
    async (req, res) => {
      const { turmaId } = req.params
      const { latitude, longitude } = req.body

      if (latitude == null || longitude == null) {
        return res.status(400).send({ message: 'Localização não enviada.' })
      }

      try {
        const turma = await prisma.class.findUnique({
          where: { id: turmaId },
        })

        if (!turma) {
          return res.status(404).send({ message: 'Turma não encontrada.' })
        }

        const token = generateToken()
        console.log('Token gerado', token)

        await prisma.$transaction(async (db) => {
          const lastLesson = await db.lesson.findFirst({
            where: {
              classId: turmaId,
            },
            orderBy: { date: 'desc' },
            include: {
              attendanceToken: true,
            },
          })

          if (lastLesson) {
            await db.lesson.update({
              where: {
                id: lastLesson.id,
              },
              data: {
                acceptPresenceByQRCode: false,
              },
            })

            if (lastLesson.attendanceToken) {
              await db.attendanceToken.update({
                where: {
                  lessonId: lastLesson.id,
                },
                data: {
                  used: true,
                  expiresAt: new Date(),
                },
              })
            }
          }

          const newlesson = await db.lesson.create({
            data: {
              classId: turmaId,
              acceptPresenceByQRCode: true,
              date: new Date(),
              latitude,
              longitude,
              attendanceToken: {
                create: {
                  token,
                  expiresAt: new Date(Date.now() + 1000 * 60 * 120),
                },
              },
            },
          })

          const alunosMatriculados = await db.enrollment.findMany({
            where: {
              classId: turmaId,
            },
            select: {
              studentId: true,
            },
          })

          await db.classAttendanceRecord.createMany({
            data: alunosMatriculados.map((aluno) => ({
              studentId: aluno.studentId,
              lessonId: newlesson.id,
            })),
          })
        })
        return res.status(201).send({ message: 'Aula cadastrada!' })
      } catch (error) {
        console.log('Não foi possível criar a aula', error)
        return res
          .status(400)
          .send({ message: 'Não foi possível criar a aula.' })
      }
      // recebe o id da turma
      // verifica os alunos pertencentes a turma
      // cria o lesson associado a turma
      // adiciona o classAtendanceRecord para os alunos baseado no lesson
    },
  )
}
