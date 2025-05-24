import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { professorRoutes } from './routes/professor'
import { turmaRoutes } from './routes/turma'
import { presencaRoutes } from './routes/presenca'
import { env } from './config/env'

const app = fastify()

app.register(fastifyJwt, {
  secret: env.SECRET_KEY,
})

app.register(fastifyCors, {
  origin: ['https://localhost:3000'],
})

app.register(professorRoutes)
app.register(turmaRoutes)
app.register(presencaRoutes)

export default app
