import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function verifyProfessorOwnsClass(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { turmaId } = req.params as { turmaId: string }
  const userId = req.user?.sub

  req.log.debug({ turmaId }, 'verifying_teacher_class_ownership')

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
    req.log.warn({ turmaId }, 'class_access_denied')
    return res.status(403).send({ message: 'Acesso negado à turma.' })
  }
}
