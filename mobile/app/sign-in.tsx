import { handleLogin } from '@/api/auth'
import Form from '@/components/Form'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'

const SignIn = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit() {
    if (!login.trim() || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos para continuar.')
      return
    }
    
    setIsLoading(true)
    const loginTrim = login.trimEnd()
    await handleLogin({
      login: loginTrim,
      password,
      onSuccess: () => router.replace('/')
    })
    setIsLoading(false)
  }
  
  return (
    <ImageBackground
      source={require('../assets/images/bg-night.png')}
      style={[styles.background, { backgroundColor: '#000000' }]}
      resizeMode='cover'
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.inner}>
            <Image
              style={styles.logo}
              source={require('@/assets/images/splash-icon.png')}
            />
            <View style={styles.formWrapper}>
              <Form
                login={login}
                password={password}
                onLoginChange={setLogin}
                onPasswordChange={setPassword}
                isLoading={isLoading}
                onSubmit={onSubmit}
                actionText='Entrar'
              />
              <Button onPress={() => router.replace('/sign-up')}>
                Não tem uma conta? Registre-se!
              </Button>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 32,
  },
  logo: {
    width: 100,
    height: 180,
    marginTop: 35,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    padding: 24,
    gap: 16,
  },
})

export default SignIn