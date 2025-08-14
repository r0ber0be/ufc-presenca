import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../lib/prisma'
import { verifySignedToken } from '../utils/QRCodeToken'

export default async function verifyStudentIsRegisteredInClass(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const { signedData } = req.body as { signedData: string }
  const { studentId } = req.params as { studentId: string }
  const studentSub = req.user.sub

  console.log(req.params)

  if (studentId !== studentSub) {
    return res.status(401).send({ message: 'Informações conflitantes.' })
  }

  const { isValid, lessonId, token } = verifySignedToken(signedData)

  if (!isValid || !studentSub || !lessonId) {
    return res.status(401).send({ message: 'Dados inválidos.' })
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
      class: {
        enrollments: {
          some: {
            studentId: studentSub,
          },
        },
      },
    },
  })

  if (!lesson) {
    return res.status(403).send({ message: 'Acesso negado.' })
  }

  req.lessonId = lessonId
  req.token = token
}
