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
  }>('/api/:turmaId/presencas/aulas', async (req, res) => {
    const { turmaId } = req.params
    await req.jwtVerify()

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
  }>('/api/:turmaId/presencas/alunos', async (req, res) => {
    const { turmaId } = req.params
    await req.jwtVerify()

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
        enrollmentId: true,
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
        enrollmentId: aluno.enrollmentId,
        name: aluno.name,
        presences: presenceMap,
      }
    })

    return res.status(200).send(tabelaFormatada)
  })

  app.post<{
    Body: Presencas[]
  }>('/api/presencas/alunos/atualizar', async (req, res) => {
    await req.jwtVerify()
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
}
