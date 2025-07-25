import { FastifyReply, FastifyRequest } from 'fastify'

export async function authPreHandler(req: FastifyRequest, res: FastifyReply) {
  const auth = req.headers.authorization
  if (!auth) {
    return res.status(401).send({ message: 'Não autorizado.' })
  }

  await req.jwtVerify()
}
