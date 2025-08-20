import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { generateToken } from '../utils/QRCodeToken'
import verifyTeacherOwnsClass from '../hooks/verifyProfessorOwnsClass'

export async function turmaRoutes(app: FastifyInstance) {
  app.get<{
    Params: { turmaId: string }
  }>('/:turmaId/report', async (req, res) => {
    const { turmaId } = req.params

    const turma = await prisma.class.findUnique({
      where: {
        id: turmaId,
      },
    })

    if (!turma) {
      return res.status(404).send({ error: 'Turma não encontrada' })
    }

    const enrolledStudents = await prisma.student.findMany({
      where: {
        enrollments: {
          some: {
            classId: turmaId,
          },
        },
      },
      include: {
        classAttendanceRecords: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    // total de aulas = quantidade de registros distintos de aulas
    const totalLessons = await prisma.lesson.count({
      where: { classId: turmaId },
    })

    const students = enrolledStudents.map((student) => {
      const presences = student.classAttendanceRecords.filter(
        (scar) => scar.present === true,
      ).length

      const absences = student.classAttendanceRecords.filter(
        (scar) => scar.present === false,
      ).length

      const percentage = totalLessons > 0 ? (presences / totalLessons) * 100 : 0

      return {
        name: student.name,
        registration: student.registrationNumber,
        presences,
        absences,
        percentage: Number(percentage.toFixed(2)),
      }
    })

    const mediaPresenca =
      students.reduce((acc, s) => acc + s.percentage, 0) /
      (enrolledStudents.length || 1)

    return res.status(200).send({
      name: turma.name,
      totalLessons,
      averagePresence: Number(mediaPresenca.toFixed(2)),
      students,
    })
  })

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

  // Buscar turmas de um aluno
  app.get<{
    Params: { studentId: string }
  }>('/:studentId/turmas', async (req, res) => {
    const { studentId } = req.params
    console.log(studentId)
    const classes = await prisma.class.findMany({
      where: {
        enrollments: {
          some: {
            studentId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        schedules: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            weekDay: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return res.status(200).send(classes)
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
    },
  )
}
