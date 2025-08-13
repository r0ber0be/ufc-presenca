import { FastifyReply, FastifyRequest } from 'fastify'

export async function authPreHandler(req: FastifyRequest, res: FastifyReply) {
  console.log(req.headers)
  const auth = req.headers.authorization
  if (!auth) {
    return res.status(401).send({ message: 'Não autorizado.' })
  }

  try {
    await req.jwtVerify()
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(401).send({ message: error.message })
    }
    return res.status(500).send({ message: 'Erro interno do servidor.' })
  }
}
