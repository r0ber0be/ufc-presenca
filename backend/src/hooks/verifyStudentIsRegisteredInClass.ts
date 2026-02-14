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

  if (studentId !== studentSub) {
    req.log.warn('conflicting_student_identifiers')
    return res.status(401).send({ message: 'Informações conflitantes.' })
  }

  const { isValid, lessonId, token } = verifySignedToken(signedData)

  if (!isValid || !studentSub || !lessonId) {
    req.log.warn('invalid_signed_qr_payload')
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
    req.log.warn({ lessonId }, 'student_not_enrolled_in_lesson_class')
    return res.status(403).send({ message: 'Acesso negado.' })
  }

  req.lessonId = lessonId
  req.token = token
}
