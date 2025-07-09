import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

type Presencas = {
  alunoId: string
  date: string
  lessonId: string
  presenca: boolean
}

export async function presencaRoutes(app: FastifyInstance) {
  app.get<{
    Params: { turmaId: string }
  }>('/:turmaId/presencas/aulas', async (req, res) => {
    const { turmaId } = req.params

    if (!turmaId || typeof turmaId !== 'string') {
      return res.status(400).send({ message: 'turmaId inválido' })
    }

    const diasDeAula = await prisma.lesson.findMany({
      where: {
        classId: turmaId,
      },
      select: {
        id: true,
        date: true,
        classId: true,
      },
    })

    if (!diasDeAula || diasDeAula.length === 0) {
      return res.status(400).send({ message: 'Nenhum dia de aula.' })
    }

    return res.status(200).send(diasDeAula)
  })

  // Retorna a presença dos alunos
  app.get<{
    Params: { turmaId: string }
  }>('/:turmaId/presencas/alunos', async (req, res) => {
    const { turmaId } = req.params

    if (!turmaId || typeof turmaId !== 'string') {
      return res.status(400).send({ message: 'turmaId inválido' })
    }

    const tabelaPresenca = await prisma.student.findMany({
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
            lesson: {
              select: {
                date: true,
              },
            },
          },
        },
      },
    })

    const tabelaFormatada = tabelaPresenca.map((aluno) => {
      const presenceMap: boolean[] = []
      aluno.classAttendanceRecords.forEach((record) => {
        presenceMap.push(record.present)
      })

      return {
        id: aluno.id,
        registrationNumber: aluno.registrationNumber,
        name: aluno.name,
        presences: presenceMap,
      }
    })

    return res.status(200).send(tabelaFormatada)
  })

  app.get<{
    Params: { turmaId: string; aulaId: string }
  }>('/presencas/aula/:turmaId', async (req, res) => {
    const { turmaId } = req.params

    const lesson = await prisma.lesson.findFirst({
      where: {
        acceptPresenceByQRCode: { equals: true },
        classId: turmaId, // se existir relação entre lesson e class
      },
    })

    if (!lesson) {
      return res.status(404).send({ message: 'Aula não encontrada.' })
    }

    console.log(lesson)
    return res.status(200).send(lesson)
  })

  app.post<{
    Body: Presencas[]
  }>('/presencas/alunos/atualizar', async (req, res) => {
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
  })

  app.patch<{
    Params: { aulaId: string }
    Body: { acceptPresenceByQRCode: boolean }
  }>('/presencas/:aulaId/atualizar', async (req, res) => {
    const { aulaId } = req.params
    const { acceptPresenceByQRCode } = req.body

    const updatedLesson = await prisma.lesson.update({
      where: {
        id: aulaId,
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
  })
}
