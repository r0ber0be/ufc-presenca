import crypto from 'node:crypto'

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

  // const hashedSignature = crypto.createHash(signature).digest()
  return `${payload}.${signature}`
}

export function verifySignedToken(signedString: string) {
  const secret = process.env.QR_SECRET_KEY!
  if (!signedString || typeof signedString !== 'string') {
    return { isValid: false, lessonId: null, token: null }
  }

  const separatorIndex = signedString.lastIndexOf('.')
  if (separatorIndex <= 0 || separatorIndex === signedString.length - 1) {
    return { isValid: false, lessonId: null, token: null }
  }

  const payload = signedString.slice(0, separatorIndex)
  const signature = signedString.slice(separatorIndex + 1)

  const payloadParts = payload.split(':')
  if (payloadParts.length !== 2 || !payloadParts[0] || !payloadParts[1]) {
    return { isValid: false, lessonId: null, token: null }
  }

  const [lessonId, token] = payloadParts

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')

  const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex')
  const signatureBuffer = Buffer.from(signature, 'hex')

  if (expectedSignatureBuffer.length !== signatureBuffer.length) {
    return { isValid: false, lessonId: null, token: null }
  }

  const isValid = crypto.timingSafeEqual(
    new Uint8Array(expectedSignatureBuffer),
    new Uint8Array(signatureBuffer),
  )

  return { isValid, lessonId, token }
}
