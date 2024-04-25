import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { FormValuesT } from "@/types/FormTypes";
import { ERRO_MUITAS_REQUISICOES, AUTH_CREDENCIAL_INVALIDA, ERRO_CREDENCIAIS_INVALIDAS, AUTH_MUITAS_REQUISICOES } from "@/lib/constants/strings";
import { removeCookies, verifyToken } from "@/utils/authUtils";

auth.useDeviceLanguage()

export async function signInWithEmailService(data: FormValuesT) {
  try {
    const { user } = await signInWithEmailAndPassword(auth, data.email, data.senha)
    const idToken = await user.getIdToken()

    await logoutService()
    await verifyToken(idToken)
  } catch (error: any) {
    if(error.code === AUTH_CREDENCIAL_INVALIDA) {
      return Promise.reject(ERRO_CREDENCIAIS_INVALIDAS)
    }
    if(error.code === AUTH_MUITAS_REQUISICOES) {
      return Promise.reject(ERRO_MUITAS_REQUISICOES)
    }
    throw error
  }
}

export async function signUpWithEmailService(data: FormValuesT) {
  const { user } = await createUserWithEmailAndPassword(auth, data.email, data.senha)
  await sendEmailVerification(user)
  await logoutService()

  const idToken = await user.getIdToken()
  await verifyToken(idToken)
  
  //let values = {
  //  title: '',
	//	description: '',
	//	status: ''
  //}

  //values.title = response === AUTH_EMAIL_JA_UTILIZADO ? ERRO_CADASTRO : CONTA_CRIADA
  //values.description = response === AUTH_EMAIL_JA_UTILIZADO ? EMAIL_EM_USO : VERIFICAR_EMAIL
  //values.status = response === AUTH_EMAIL_JA_UTILIZADO ? 'warning' : 'success'
  //
  //return { values, response }
}

export async function googleAuthService() {
  if(!auth.currentUser) {
    const provider = new GoogleAuthProvider()
    provider.addScope('openid')

    const { user } = await signInWithPopup(auth, provider)
    const idToken = await user.getIdToken()

    await logoutService()
    await verifyToken(idToken)
  } else {
    logoutService()
  }
}

export async function logoutService() {
  try {
    await signOut(auth)
    await removeCookies()
  } catch (error) {
    console.log(error)
    return error
  }
}