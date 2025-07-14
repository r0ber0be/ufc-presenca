import { prisma } from '../lib/prisma'

export async function markExpiredToken() {
  const expiredTokens = await prisma.attendanceToken.findMany({
    where: {
      used: false,
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  for (const token of expiredTokens) {
    await prisma.attendanceToken.update({
      where: {
        id: token.id,
      },
      data: {
        used: true,
      },
    })

    await prisma.lesson.update({
      where: {
        id: token.lessonId,
      },
      data: {
        acceptPresenceByQRCode: false,
      },
    })
  }
  console.log(`${expiredTokens.length} tokens expirados foram encerrados.`)
}
