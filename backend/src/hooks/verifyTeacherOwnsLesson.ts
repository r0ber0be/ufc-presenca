import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function verifyTeacherOwnsLesson(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { aulaId } = req.params as { aulaId: string }
  const userId = req.user?.sub

  console.log(aulaId, userId)

  if (!aulaId || !userId) {
    return res.status(400).send({ message: 'Requisição inválida.' })
  }

  const aula = await prisma.lesson.findFirst({
    where: {
      id: aulaId,
      class: {
        teacher: {
          uid: userId,
        },
      },
    },
  })

  if (!aula) {
    return res.status(403).send({ message: 'Acesso negado a esta aula.' })
  }
}
