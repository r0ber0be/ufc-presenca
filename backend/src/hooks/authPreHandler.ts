import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'

export async function authPreHandler(req: FastifyRequest, res: FastifyReply) {
  const auth = req.headers.authorization
  if (!auth) {
    return res.status(401).send({ message: 'Não autorizado.' })
  }

  try {
    await req.jwtVerify()
    await req.jwtVerify()

    const { sub, role } = req.user as { sub?: string; role?: string }
    if (!sub) {
      return res.status(401).send({ message: 'Sessão inválida.' })
    }

    let userExists = false
    if (role === 'teacher') {
      userExists = Boolean(
        await prisma.teacher.findUnique({
          where: { uid: sub },
          select: { id: true },
        }),
      )
    } else if (role === 'student') {
      userExists = Boolean(
        await prisma.student.findUnique({
          where: { id: sub },
          select: { id: true },
        }),
      )
    } else {
      const [teacher, student] = await Promise.all([
        prisma.teacher.findUnique({
          where: { uid: sub },
          select: { id: true },
        }),
        prisma.student.findUnique({
          where: { id: sub },
          select: { id: true },
        }),
      ])
      userExists = Boolean(teacher || student)
    }

    if (!userExists) {
      return res.status(401).send({
        message: 'Sessão inválida. Faça login novamente.',
      })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(401).send({ message: error.message })
    }
    return res.status(500).send({ message: 'Erro interno do servidor.' })
  }
}
