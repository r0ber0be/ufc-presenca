import { FastifyRequest, FastifyReply } from 'fastify'

export default async function verifyRole(
  req: FastifyRequest,
  res: FastifyReply,
) {
  try {
    const { role } = await req.jwtDecode<{ role: string }>()

    if (role !== 'teacher') {
      req.log.warn('access_denied_invalid_role')
      return res.status(403).send({ message: 'Acesso negado.' })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      req.log.warn({ err: error }, 'jwt_decode_failed')
      return res
        .status(401)
        .send({ message: 'Acesso negado. Você não é um professor.' })
    }
    return res.code(500).send({ message: 'Erro interno do servidor.' })
  }
}
