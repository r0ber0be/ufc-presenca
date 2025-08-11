import { saveToken } from '@/hooks/useAuthToken'
import { saveStudentData } from '@/hooks/useStudentData'
import { Alert } from 'react-native'

type UserProps = {
  login: string
  password: string
  deviceId: string
  onSuccess: () => void
}

export async function handleLogin({ login, password, deviceId, onSuccess }: UserProps) {
  try {
    const response = await fetch('http://192.168.3.6:3333/api/aluno/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        deviceId, // TODO: Pesquisar como pegar essa informação 
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