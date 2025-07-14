import crypto from 'crypto'

export function generateToken() {
  const token = crypto.randomBytes(16).toString('hex')
  return token
}

export function signToken(lessonId: string, token: string) {
  const payload = `${lessonId}:${token}`
  const secret = process.env.QR_SECRET_KEY!
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  return `${payload}.${signature}`
}

export function verifySignedToken(signedString: string) {
  const secret = process.env.QR_SECRET_KEY!
  const [payload, signature] = signedString.split('.')
  const [lessonId, token] = payload.split(':')

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  const isValid = expectedSignature === signature

  return { isValid, lessonId, token }
}
