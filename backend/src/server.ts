import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { professorRoutes } from './routes/professor'

const app = fastify()

app.register(fastifyCors, {
  origin: ['https://localhost:3000'],
})

app.register(fastifyJwt, {
  secret: 'ufc-presença',
})

app.register(professorRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
