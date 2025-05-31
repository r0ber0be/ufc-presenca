import { FastifyInstance } from 'fastify'
import { authPreHandler } from '../hooks/authPreHandler'
import { turmaRoutes } from '../routes/turma'
import { presencaRoutes } from '../routes/presenca'

export async function authenticatedRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authPreHandler)

  app.register(turmaRoutes, { prefix: '/api' })
  app.register(presencaRoutes, { prefix: '/api' })
}
