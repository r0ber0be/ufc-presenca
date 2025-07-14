import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function verifyProfessorOwnsClass(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { turmaId } = req.params as { turmaId: string }
  const userId = req.user?.sub

  console.log(turmaId, userId)

  if (!turmaId || !userId) {
    return res.status(400).send({ message: 'Requisição inválida.' })
  }

  const turma = await prisma.class.findFirst({
    where: {
      id: turmaId,
      teacher: {
        uid: userId,
      },
    },
  })

  if (!turma) {
    return res.status(403).send({ message: 'Acesso negado à turma.' })
  }
}
