import * as admin from 'firebase-admin'
import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../../serviceAccountKey.json')

const appAdm = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

interface RequestBody {
  uid: string
  name: string
  email: string
  picture: string
  idToken: string
}

export async function professorRoutes(app: FastifyInstance) {
  app.post('/api/create/professor', async (request) => {
    const { uid, name, email, picture } = request.body as RequestBody

    const professorExists = await prisma.professor.findUnique({
      where: { uid },
    })

    if (professorExists) {
      return { error: 'Usuário já cadastrado!' }
    }
    const newProfessor = await prisma.professor.create({
      data: {
        uid,
        name,
        email,
        isSynced: false,
        picture,
      },
    })
    return newProfessor
  })

  app.post('/api/verifytoken/professor', async (req, res) => {
    const { idToken } = req.body as RequestBody

    const professorInfo = await admin
      .auth(appAdm)
      .verifyIdToken(idToken, true)
      .then(async (decodedToken) => {
        return decodedToken
      })
      .catch((error) => {
        if (error.code === 'auth/id-token-revoked') {
          // O token foi revogado. Informar ao usuário para reautenticar ou signOut() o usuário.
          return res.status(401).send({ message: 'Você precisa reautenticar' })
        } else {
          return res.status(401).send({ message: error }) // o token é inválido
        }
      })
    const { uid, email } = professorInfo
    let { name, picture } = professorInfo

    if (!name) {
      name = 'John Doe'
    }
    if (!picture) {
      picture = '...'
    }

    let professor = await prisma.professor.findUnique({
      where: { uid },
    })

    if (!professor) {
      console.log('Professor não existe')
      professor = await prisma.professor.create({
        data: {
          uid,
          name,
          email,
          isSynced: false,
          picture,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name,
        picture,
        isSynced: professor.isSynced,
      },
      {
        sub: uid,
        expiresIn: '7 days',
      },
    )
    return res.status(200).send(token)
  })

  app.get('/fakeGETexample', async (request, response) => {
    await request.jwtVerify() // verifica se a requisição feita pelo frontend contém o token do usuário
    const { user } = request
    console.log(user)
    return response
  })
}
