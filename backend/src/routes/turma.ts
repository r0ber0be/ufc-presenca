import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { generateToken } from '../utils/QRCodeToken'
import verifyTeacherOwnsClass from '../hooks/verifyProfessorOwnsClass'
import { PrismaClientValidationError } from '../generated/client/runtime/library'
import { buildSchedulesPayload } from '../utils/scheduleParser'
import { safeParseBrazilianDate } from '../helpers/datesParser'
import { parseStringToNumber } from '../helpers/numbersParser'

type TurmaCronogramaItem = {
  dia: string
  horario: string
}

type TurmaSemestrePayload = {
  inicio: string
  fim: string
  atual: boolean
}

type TurmaPayload = {
  codigo: string
  nome: string
  semestre: TurmaSemestrePayload
  local: string
  quantidadeDeAlunos: string
  capacidadeDeAlunos: string
  cronograma: TurmaCronogramaItem[]
}

type SyncTurmasBody = {
  turmas: TurmaPayload[]
}

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
  app.get<{
    Params: { sub: string }
  }>('/turmas', async (req, res) => {
    try {
      const { sub } = req.user
      const { type } = req.query

      if (type === 'extension') {
        const professorData = await prisma.teacher.findFirst({
          where: { uid: sub },
          select: {
            classes: {
              select: {
                id: true,
                name: true,
                code: true,
                _count: {
                  select: { lessons: true },
                },
                enrollments: {
                  select: {
                    student: {
                      select: {
                        name: true,
                        registrationNumber: true,
                        classAttendanceRecords: {
                          where: { present: true },
                          select: {
                            lesson: {
                              select: { classId: true },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        })

        if (!professorData?.classes) {
          return res.status(404).send({ message: 'Nenhuma turma encontrada' })
        }

        const turmasFormatadas = professorData.classes.map((turma) => {
          // Evita divisão por zero se não houver aulas
          const totalAulas = turma._count.lessons || 1

          const alunos = turma.enrollments.map((enrollment) => {
            const estudante = enrollment.student

            // Precisamos contar apenas as presenças do aluno que pertencem a ESTA turma (turma.id).
            const presencasNaTurma = estudante.classAttendanceRecords.filter(
              (record) => record.lesson.classId === turma.id,
            ).length

            const porcentagem = ((presencasNaTurma / totalAulas) * 100).toFixed(
              2,
            )

            return {
              matricula: estudante.registrationNumber,
              nome: estudante.name,
              porcentagem: Number(porcentagem),
            }
          })

          return {
            id: turma.id,
            nome: turma.name,
            codigo: turma.code,
            alunos,
          }
        })

        return res.status(200).send(turmasFormatadas)
      }

      const professorTurmas = await prisma.teacher.findFirst({
        where: { uid: sub },
        include: {
          classes: {
            select: {
              id: true,
              name: true,
              code: true,
              quantityOfEnrollments: true,
              location: true,
              ongoingSemester: true,
              semesterBeginsIn: true,
              semesterEndsIn: true,
              current: true,
              schedules: {
                select: {
                  startTime: true,
                  endTime: true,
                  weekDay: true,
                },
              },
            },
          },
        },
      })

      if (!professorTurmas?.classes.length) {
        return res.status(404).send({ message: 'Nenhuma turma encontrada' })
      }

      return res.status(200).send(professorTurmas.classes)
    } catch (error) {
      console.log('Erro ao buscar turmas:', error)
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

  // Sincronizar as turmas com o sigaa
  app.post<{
    Params: { sub: string }
    Body: SyncTurmasBody
  }>('/sync/turmas', async (req, res) => {
    console.log(req.user)
    const { sub } = req.user
    const { turmas } = req.body

    try {
      const teacher = await prisma.teacher.findUnique({
        where: { uid: sub },
      })

      if (!teacher) {
        return res.status(404).send({ message: 'Professor não encontrado.' })
      }

      if (!turmas || turmas.length === 0) {
        return res.status(200).send({
          message: 'Nenhuma turma para sincronizar.',
        })
      }

      await prisma.$transaction(async (db) => {
        await db.teacher.update({
          where: {
            uid: sub,
          },
          data: { isSynced: true },
        })

        const turmasAtualizadas = []
        for (const turma of turmas) {
          const semesterBeginsIn = safeParseBrazilianDate(turma.semestre.inicio)
          const semesterEndsIn = safeParseBrazilianDate(turma.semestre.fim)
          const quantityOfEnrollments = parseStringToNumber(
            turma.quantidadeDeAlunos,
          )
          const capacityOfEnrollments = parseStringToNumber(
            turma.capacidadeDeAlunos,
          )
          const schedulesData = buildSchedulesPayload(turma.cronograma)
          const turmaSalva = await db.class.upsert({
            where: {
              code: turma.codigo,
              teacherId: teacher.id,
            },
            create: {
              code: turma.codigo,
              name: turma.nome,
              teacherId: teacher.id,
              location: turma.local,
              ongoingSemester: turma.semestre.atual,
              semesterBeginsIn,
              semesterEndsIn,
              quantityOfEnrollments,
              capacityOfEnrollments,
              schedules: {
                create: schedulesData,
              },
            },
            update: {
              name: turma.nome,
              quantityOfEnrollments,
              schedules: {
                deleteMany: {},
                create: schedulesData,
              },
            },
          })
          turmasAtualizadas.push(turmaSalva)
        }
        return turmasAtualizadas
      })
      return res
        .status(201)
        .send({ message: 'Sincronização realizada com sucesso!' })
    } catch (error: unknown) {
      if (error instanceof PrismaClientValidationError) {
        console.log(error)
        return res.status(422).send({ message: 'Erro ao validar os dados.' })
      }
      console.log('ERRO:', error)
      return res.status(500).send({ message: 'Erro interno do servidor.' })
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
                  revokedAt: new Date(),
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
                  issuedAt: new Date(),
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
