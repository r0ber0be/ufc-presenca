import { getOrCreateDeviceId } from "@/hooks/useDeviceId"
import { authenticateUser } from "@/utils/authWithBiometrics"
import { Alert } from "react-native"

type UserProps = {
  login: string
  password: string
  onSuccess: () => void
}

export async function handleRegistration({ login, password, onSuccess }: UserProps) {
  try {
    await authenticateUser()
    const deviceId = await getOrCreateDeviceId()
    const response = await fetch('http://192.168.3.6:3333/api/aluno/cadastro', {
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

    const { message } = await response.json()

    onSuccess()
    Alert.alert('Sucesso!', message)
  } catch (error: unknown) {
    if(error instanceof Error) {
      Alert.alert('Um erro ocorreu', error.message)
    }
  }
}