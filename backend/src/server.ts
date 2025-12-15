import fastify from 'fastify'
import fastifyHelmet from '@fastify/helmet'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { env } from './config/env'
import { professorRoutes } from './routes/professor'
import { authenticatedRoutes } from './plugins/authenticatedRoutes'
import { alunoRoutes } from './routes/aluno'

const app = fastify({
  logger: {
    redact: ['req.headers.authorization'],
    transport: {
      target: 'pino-pretty',
    },
  },
  connectionTimeout: 30000,
})

app.register(fastifyJwt, {
  secret: env.SECRET_KEY,
})

app.register(fastifyCors, {
  origin: [
    'https://localhost:3000',
    'exp://192.168.3.6:8081',
    'https://si3.ufc.br',
  ],
  methods: ['GET', 'POST'],
  credentials: true,
})

app.register(fastifyHelmet, {
  global: true,
  frameguard: { action: 'deny' },
})

app.register(authenticatedRoutes)
app.register(professorRoutes)
app.register(alunoRoutes)

export default app
