import * as LocalAuthentication from 'expo-local-authentication'

export async function authenticateUser() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync()
  if (!hasHardware) {
    throw new Error('Seu dispositivo não suporta autenticação biométrica/PIN.')
  }

  const isEnrolled = await LocalAuthentication.isEnrolledAsync()
  if (!isEnrolled) {
    throw new Error('Nenhuma biometria ou PIN configurado no dispositivo.')
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Confirme sua identidade',
    fallbackLabel: 'Usar PIN',
    disableDeviceFallback: false,
  })

  if (!result.success) {
    throw new Error('Autenticação falhou.')
  }

  return true
}
