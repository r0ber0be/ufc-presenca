import { FastifyInstance } from 'fastify'
import { verifySignedToken } from '../utils/QRCodeToken'
import { prisma } from '../lib/prisma'
import { geolocationVerifier } from '../utils/geolocationVerifier'
import { studentSigaaLogin } from '../lib/sigaa/alunoScraper'

export async function alunoRoutes(app: FastifyInstance) {
  // Login do aluno
  app.post<{
    Body: { login: string; password: string }
    Headers: { deviceId: string }
  }>('/api/testeloginalunosigaa', async (req, res) => {
    const { login, password } = req.body
    const deviceId = req.headers.deviceid

    console.log(deviceId)

    if (!login || !password) {
      return res.status(400).send('Dados de acesso incorretos ou inválidos.')
    }

    if (!deviceId) {
      return res
        .status(400)
        .send({ message: 'Falha ao receber dados do dispositivo.' })
    }

    try {
      const { name, registrationNumber } = await studentSigaaLogin(
        login,
        password,
      )

      const student = await prisma.student.findUnique({
        where: {
          registrationNumber_deviceId: {
            registrationNumber,
            deviceId,
          },
        },
      })

      if (!student) {
        return res.status(404).send({
          message: `O aluno ${name} ainda não foi cadastrado. Cadastre-se para continuar.`,
        })
      }

      const token = app.jwt.sign(
        {
          id: student.id,
          name: student.name,
          registrationNumber: student.registrationNumber,
          role: 'student',
        },
        {
          sub: student.id,
          expiresIn: '7 days',
        },
      )

      return res.status(200).send(token)
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).send({ message: error.message })
      }
    }
  })

  app.post<{
    Body: { login: string; password: string }
    Headers: { deviceId: string }
  }>('/api/aluno/cadastro', async (req, res) => {
    const { login, password } = req.body
    const deviceId = req.headers.deviceid

    if (!deviceId) {
      return res
        .status(400)
        .send({ message: 'Falha ao receber dados do dispositivo.' })
    }

    const isStudentDeviceAlreadyTaken = await prisma.student.findUnique({
      where: {
        deviceId,
      },
    })

    if (isStudentDeviceAlreadyTaken) {
      res
        .status(409)
        .send({ message: 'O dispositivo já está vínculado a outra conta.' })
    }

    try {
      const { name, registrationNumber } = await studentSigaaLogin(
        login,
        password,
      )

      const isStudentRegistrationNumberTaken = await prisma.student.findUnique({
        where: {
          registrationNumber,
        },
      })

      if (isStudentRegistrationNumberTaken) {
        res.status(409).send({ message: 'Matrícula já vinculada a uma conta.' })
      }

      const newStudent = await prisma.student.create({
        data: {
          name,
          registrationNumber,
          deviceId,
        },
      })

      return res.status(201).send({
        message: `${newStudent.name} - (
        ${newStudent.registrationNumber}) foi cadastrado com sucesso!`,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).send({ message: error.message })
      }
    }
  })

  // Realiza a presença do aluno
  app.post<{
    Body: { signedData: string; latitude: GLfloat; longitude: GLfloat }
    Params: { alunoId: string }
  }>('/api/:alunoId/presenca/qr', async (req, res) => {
    const { signedData, latitude, longitude } = req.body
    console.log('latlong', latitude, longitude)
    const { alunoId } = req.params
    const { isValid, lessonId, token } = verifySignedToken(signedData)
    console.log('Token recebido:', isValid, lessonId, token)

    if (!isValid) {
      return res.status(401).send({ mensagem: 'Dados inválidos.' })
    }

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
      select: {
        classId: true,
        acceptPresenceByQRCode: true,
        latitude: true,
        longitude: true,
        class: {
          select: {
            name: true,
          },
        },
        attendanceToken: {
          select: {
            token: true,
            used: true,
            expiresAt: true,
          },
        },
      },
    })

    if (!lesson || !lesson.attendanceToken) {
      return res.status(404).send({ mensagem: 'Aula não encontrada.' })
    }

    const now = new Date()
    if (
      !lesson.acceptPresenceByQRCode ||
      lesson.attendanceToken.used ||
      !lesson.attendanceToken.token ||
      lesson.attendanceToken.token !== token ||
      (lesson.attendanceToken.expiresAt &&
        lesson.attendanceToken.expiresAt < now)
    ) {
      return res
        .status(403)
        .send({ mensagem: 'Esta aula não aceita mais registros.' })
    }

    if (!latitude || !longitude || !lesson.latitude || !lesson.longitude) {
      return res.status(400).send('Informações do local não foram recebidas.')
    }

    try {
      await geolocationVerifier(
        latitude,
        longitude,
        lesson.latitude,
        lesson.longitude,
      )
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .send({ message: 'Você não está próximo a sala de aula.' })
    }

    const alunoMatriculado = await prisma.enrollment.findFirst({
      where: {
        classId: lesson.classId,
        studentId: alunoId,
      },
    })

    if (!alunoMatriculado) {
      return res
        .status(403)
        .send({ mensagem: 'Você não está matriculado nesta turma.' })
    }

    const registro = await prisma.classAttendanceRecord.updateMany({
      where: {
        studentId: alunoId,
        lessonId,
        present: false,
      },
      data: {
        present: true,
        latitude,
        longitude,
      },
    })

    if (registro.count === 0) {
      return res.status(400).send({ mensagem: 'Presença já registrada.' })
    }

    const [totalPresentes, totalAlunos] = await Promise.all([
      prisma.classAttendanceRecord.count({
        where: {
          lessonId,
          present: true,
        },
      }),
      prisma.classAttendanceRecord.count({
        where: {
          lessonId,
        },
      }),
    ])

    if (totalPresentes >= totalAlunos) {
      await prisma.attendanceToken.update({
        where: {
          lessonId,
        },
        data: {
          used: true,
        },
      })
    }

    return res.status(200).send({
      mensagem: `Presença registrada com sucesso em ${lesson.class.name}!`,
    })
  })
}
