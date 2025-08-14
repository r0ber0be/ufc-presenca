import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import verifyTeacherOwnsClass from '../hooks/verifyProfessorOwnsClass'
import verifyTeacherOwnsLesson from '../hooks/verifyTeacherOwnsLesson'
import { signToken } from '../utils/QRCodeToken'

type Presencas = {
  alunoId: string
  date: string
  lessonId: string
  presenca: boolean
}

export async function presencaRoutes(app: FastifyInstance) {
  app.get<{
    Params: { turmaId: string }
  }>(
    '/:turmaId/presencas/aulas',
    { preHandler: verifyTeacherOwnsClass },
    async (req, res) => {
      const { turmaId } = req.params

      const diasDeAula = await prisma.lesson.findMany({
        where: {
          classId: turmaId,
        },
        select: {
          id: true,
          date: true,
          classId: true,
        },
        orderBy: {
          date: 'asc',
        },
      })

      if (!diasDeAula || diasDeAula.length === 0) {
        return res.status(400).send({ message: 'Nenhum dia de aula.' })
      }

      return res.status(200).send(diasDeAula)
    },
  )

  // Retorna a presença dos alunos
  app.get<{
    Params: { turmaId: string }
  }>(
    '/:turmaId/presencas/alunos',
    { preHandler: verifyTeacherOwnsClass },
    async (req, res) => {
      const { turmaId } = req.params

      const alunos = await prisma.student.findMany({
        where: {
          enrollments: {
            some: {
              classId: turmaId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          registrationNumber: true,
          classAttendanceRecords: {
            where: {
              lesson: {
                classId: turmaId,
              },
            },
            select: {
              present: true,
              lessonId: true,
              lesson: {
                select: {
                  date: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      const alunosComPresencas = alunos.map((aluno) => {
        const presencesMap: { [lessonId: string]: boolean } = {}

        for (const record of aluno.classAttendanceRecords) {
          presencesMap[record.lessonId] = record.present
        }

        return {
          id: aluno.id,
          registrationNumber: aluno.registrationNumber,
          name: aluno.name,
          presences: presencesMap,
        }
      })

      console.log(alunosComPresencas)

      return res.status(200).send(alunosComPresencas)
    },
  )

  app.get<{
    Params: { turmaId: string }
  }>(
    '/presencas/aula/:turmaId',
    { preHandler: verifyTeacherOwnsClass },
    async (req, res) => {
      const { turmaId } = req.params

      const lesson = await prisma.lesson.findFirst({
        where: {
          classId: turmaId,
          acceptPresenceByQRCode: {
            equals: true,
          },
          attendanceToken: {
            used: false,
          },
        },
        orderBy: { date: 'desc' },
        select: {
          id: true,
          acceptPresenceByQRCode: true,
          classId: true,
          attendanceToken: {
            select: {
              token: true,
            },
          },
        },
      })

      if (!lesson || !lesson.attendanceToken?.token) {
        return res
          .status(404)
          .send({ message: 'Nenhuma aula ativa encontrada.' })
      }

      const { id, classId, acceptPresenceByQRCode, attendanceToken } = lesson

      const signedToken = signToken(id, attendanceToken.token)

      console.log(signedToken)
      return res
        .status(200)
        .send({ id, classId, acceptPresenceByQRCode, signedToken })
    },
  )

  app.post<{
    Body: Presencas[]
    Params: { turmaId: string }
  }>(
    '/presencas/alunos/:turmaId/atualizar',
    { preHandler: verifyTeacherOwnsClass },
    async (req, res) => {
      const presencasAtualizadas = req.body

      await prisma.$transaction(async (db) => {
        for (const record of presencasAtualizadas) {
          await db.classAttendanceRecord.update({
            where: {
              studentId_lessonId: {
                studentId: record.alunoId,
                lessonId: record.lessonId,
              },
            },
            data: {
              present: record.presenca,
            },
          })
        }
      })

      return res.status(200).send('Dados atualizados!')
    },
  )

  // Permite abrir ou fechar uma aula
  app.patch<{
    Params: { turmaId: string; aulaId: string }
    Body: { acceptPresenceByQRCode: boolean }
  }>(
    '/presencas/:turmaId/:aulaId/atualizar',
    { preHandler: [verifyTeacherOwnsClass, verifyTeacherOwnsLesson] },
    async (req, res) => {
      const { turmaId, aulaId } = req.params
      const { acceptPresenceByQRCode } = req.body

      const updatedLesson = await prisma.lesson.update({
        where: {
          id: aulaId,
          class: {
            id: turmaId,
          },
        },
        data: {
          acceptPresenceByQRCode,
        },
        select: {
          id: true,
          classId: true,
          acceptPresenceByQRCode: true,
          date: true,
        },
      })

      return res.status(200).send(updatedLesson)
    },
  )
}
