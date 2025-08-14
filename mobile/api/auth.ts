import { saveToken } from '@/hooks/useAuthToken'
import { getDeviceId } from '@/hooks/useDeviceId'
import { saveStudentData } from '@/hooks/useStudentData'
import { authenticateUser } from '@/utils/authWithBiometrics'
import { Alert } from 'react-native'

type UserProps = {
  login: string
  password: string
  onSuccess: () => void
}

export async function handleLogin({ login, password, onSuccess }: UserProps) {
  try {
    await authenticateUser()
    const deviceId = await getDeviceId()
    const response = await fetch('http://192.168.3.6:3333/api/aluno/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        deviceId,
      },
      body: JSON.stringify({ login, password }),
    })

    if (!response.ok) {
      const { message } = await response.json()
      throw new Error(message)
    }

    const { token, message } = await response.json()

    await saveToken(token)
    await saveStudentData()

    Alert.alert('Sucesso!', message)

    onSuccess()
  } catch (error: unknown) {
    if(error instanceof Error) {
      Alert.alert('Um erro ocorreu', error.message)
    }
  }
}