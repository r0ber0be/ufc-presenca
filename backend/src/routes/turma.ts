import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function turmaRoutes(app: FastifyInstance) {
  const turmasMock = [
    {
      id: 1,
      name: 'Fundamentos da programação',
      days: 'SEG, TER',
      hour: '13:30 - 15:30',
      extraHour: null,
    },
    {
      id: 2,
      name: 'Projeto de pesquisa cientifica e tecnológica',
      days: 'SEG, TER',
      hour: '10:00 - 12:00',
      extraHour: '15:30 - 17:30',
    },
    {
      id: 3,
      name: 'Matemática Básica',
      days: 'QUA',
      hour: '13:30 - 15:30',
      extraHour: null,
    },
    {
      id: 4,
      name: 'Arquitetura de Computadores',
      days: 'QUI, SEX',
      hour: '10:00 - 12:00',
    },
    {
      id: 5,
      name: 'Computação Gráfica',
      days: 'SEX',
      hour: '18:00 - 20:00',
    },
  ]

  app.get('/api/turmas', async (req, res) => {
    console.log(req.body)
    const { sub } = await req.jwtVerify()

    const professor = await prisma.professor.findUnique({
      where: { uid: sub },
    })

    if (!professor) {
      return res.status(401).send({ message: 'Não autorizado' })
    }
    return turmasMock
  })
}
