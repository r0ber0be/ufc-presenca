import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'

export default async function verifyTeacherOwnsLesson(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { aulaId } = req.params as { aulaId: string }
  const userId = req.user?.sub

  req.log.debug({ aulaId }, 'verifying_teacher_lesson_ownership')

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
    req.log.warn({ aulaId }, 'lesson_access_denied')
    return res.status(403).send({ message: 'Acesso negado a esta aula.' })
  }
}
