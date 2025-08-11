import { Alert } from "react-native"

type UserProps = {
  login: string
  password: string
  deviceId: string
  onSuccess: () => void
}

export async function handleRegistration({ login, password, deviceId, onSuccess }: UserProps) {
  try {
    const response = await fetch('http://192.168.3.6:3333/api/aluno/cadastro', {
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

    const { message } = await response.json()

    onSuccess()
    Alert.alert('Sucesso!', message)
  } catch (error: unknown) {
    if(error instanceof Error) {
      Alert.alert('Um erro ocorreu', error.message)
    }
  }
}