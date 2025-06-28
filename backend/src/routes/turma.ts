import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function turmaRoutes(app: FastifyInstance) {
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
              numberOfStudents: true,
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

  // Nova aula
  app.post<{
    Params: { turmaId: string }
  }>('/:turmaId/aula', async (req, res) => {
    const { turmaId } = req.params

    try {
      const turma = await prisma.class.findUnique({
        where: { id: turmaId },
      })

      if (!turma) {
        return res.status(404).send({ message: 'Turma não encontrada.' })
      }

      await prisma.$transaction(async (db) => {
        const lesson = await db.lesson.create({
          data: {
            classId: turmaId,
            acceptPresenceByQRCode: true,
            date: new Date(),
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

        console.log('alunos da turma:', alunosMatriculados)

        await db.classAttendanceRecord.createMany({
          data: alunosMatriculados.map((aluno) => ({
            studentId: aluno.studentId,
            lessonId: lesson.id,
          })),
        })
      })
      return res.status(201).send({ message: 'Aula cadastrada!' })
    } catch (error) {
      console.log('Não foi possível criar a aula', error)
      return res.status(400).send({ message: 'Não foi possível criar a aula.' })
    }
    // recebe o id da turma
    // verifica os alunos pertencentes a turma
    // cria o lesson associado a turma
    // adiciona o classAtendanceRecord para os alunos baseado no lesson
  })
}
