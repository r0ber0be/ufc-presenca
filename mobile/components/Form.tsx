import { Button, TextInput } from 'react-native-paper'

interface FormProps {
  login: string
  password: string
  onLoginChange: (text: string) => void
  onPasswordChange: (text: string) => void
  isLoading: boolean
  onSubmit: () => void
  actionText: string
}

const Form = ({
  login,
  password,
  onLoginChange,
  onPasswordChange,
  isLoading,
  onSubmit,
  actionText,
}: FormProps) => {
  const isDisabled = isLoading || !login.trim() || !password.trim()
  return (
    <>
      <TextInput 
        placeholder='Insira seu nome de usuário do SIGAA'
        mode='outlined'
        label='Usuário'
        value={login} 
        onChangeText={onLoginChange}
        disabled={isLoading}
      />
      <TextInput
        placeholder='Insira sua senha do SIGAA'
        mode='outlined'
        label='Senha'
        value={password} 
        secureTextEntry
        onChangeText={onPasswordChange}
        disabled={isLoading}
      />
      <Button
        mode='contained'
        loading={isLoading}
        disabled={isDisabled}
        onPress={onSubmit}
      >
        {actionText}
      </Button>
    </>
  )
}

export default Form