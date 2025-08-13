import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { geolocationVerifier } from '../utils/geolocationVerifier'
import { studentSigaaLogin } from '../lib/sigaa/alunoScraper'
import { authPreHandler } from '../hooks/authPreHandler'
import verifyStudentIsRegisteredInClass from '../hooks/verifyStudentIsRegisteredInClass'

export async function alunoRoutes(app: FastifyInstance) {
  // Login do aluno
  app.post<{
    Body: { login: string; password: string }
    Headers: { deviceId: string }
  }>('/api/aluno/login', async (req, res) => {
    const { login, password } = req.body
    const deviceId = req.headers.deviceid

    console.log(deviceId)

    if (!login || !password) {
      return res
        .status(400)
        .send({ message: 'Dados de acesso incorretos ou inválidos.' })
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
          message: `Este aluno ainda não foi cadastrado. Cadastre-se para continuar.`,
        })
      }

      if (student.deviceId !== deviceId) {
        return res
          .status(403)
          .send({ message: 'Esta conta está vinculada a outro dispositivo.' })
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

      return res.status(200).send({ message: `Seja bem vindo ${name}!`, token })
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error)
        return res.status(400).send({ message: error.message })
      }
      return res.status(500).send({ message: 'Erro interno do servidor' })
    }
  })

  app.post<{
    Body: { login: string; password: string }
    Headers: { deviceId: string }
  }>('/api/aluno/cadastro', async (req, res) => {
    const { login, password } = req.body
    const deviceId = req.headers.deviceid

    if (!login || !password) {
      return res.status(400).send({ message: 'Dados inválidos.' })
    }

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
      return res
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
        return res
          .status(409)
          .send({ message: 'Matrícula já vinculada a uma conta.' })
      }

      const newStudent = await prisma.student.create({
        data: {
          name,
          registrationNumber,
          deviceId,
        },
      })

      const firstName = newStudent.name.split(' ')[0]

      return res.status(201).send({
        message: `O aluno ${firstName} - (${newStudent.registrationNumber}) foi cadastrado!`,
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).send({ message: error.message })
      }
      return res.status(500).send({ message: 'Erro interno do servidor' })
    }
  })

  // Realiza a presença do aluno
  app.post<{
    Body: { signedData: string; latitude: GLfloat; longitude: GLfloat }
    Params: { studentId: string }
    Headers: { deviceId: string }
  }>(
    '/api/:studentId/presenca/qr',
    { preHandler: [authPreHandler, verifyStudentIsRegisteredInClass] },
    async (req, res) => {
      const { latitude, longitude } = req.body
      console.log('latlong', latitude, longitude)
      const { lessonId, token } = req
      const { studentId } = req.params
      const deviceId = req.headers.deviceid

      if (!deviceId) {
        return res
          .status(400)
          .send({ message: 'Falha ao receber dados do dispositivo.' })
      }

      if (!latitude || !longitude) {
        return res
          .status(400)
          .send({ message: 'A localização não foi disponibilizada.' })
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
        return res.status(404).send({ message: 'Aula não encontrada.' })
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
          .send({ message: 'Esta aula não aceita mais registros.' })
      }

      if (!latitude || !longitude || !lesson.latitude || !lesson.longitude) {
        return res
          .status(400)
          .send({ message: 'Informações do local não foram recebidas.' })
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
          studentId,
        },
      })

      if (!alunoMatriculado) {
        return res
          .status(403)
          .send({ message: 'Você não está matriculado nesta turma.' })
      }

      const registro = await prisma.classAttendanceRecord.updateMany({
        where: {
          studentId,
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
        return res.status(400).send({ message: 'Presença já registrada.' })
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
        message: `Presença registrada com sucesso em ${lesson.class.name}!`,
      })
    },
  )
}
