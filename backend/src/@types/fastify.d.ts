import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    lessonId?: string
    token?: string
  }
}
