import { FastifyRequest, FastifyReply } from 'fastify'

export default async function verifyRole(
  req: FastifyRequest,
  res: FastifyReply,
) {
  console.log('aqui')
  try {
    const { role } = await req.jwtDecode<{ role: string }>()
    console.log('dentro do try catch', role)
    if (role !== 'teacher') {
      return res.status(403).send({ message: 'Acesso negado.' })
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('[DEBUG]:', error)
      return res
        .status(401)
        .send({ message: 'Acesso negado. Você não é um professor.' })
    }
    return res.code(500).send({ message: 'Erro interno do servidor.' })
  }
}
