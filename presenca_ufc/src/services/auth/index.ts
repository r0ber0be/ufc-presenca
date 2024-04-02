import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential, signOut, sendEmailVerification, applyActionCode, User, setPersistence, browserLocalPersistence, browserSessionPersistence, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { FirebaseError } from "firebase/app";
import { FormValuesT } from "@/types/FormTypes";
import { CONTA_CRIADA, EMAIL_EM_USO, ERRO_MUITAS_REQUISICOES, ERRO_EMAIL_NAO_VERIFICADO, ERRO_CADASTRO, VERIFICAR_EMAIL, AUTH_CREDENCIAL_INVALIDA, ERRO_CREDENCIAIS_INVALIDAS, AUTH_MUITAS_REQUISICOES, AUTH_EMAIL_JA_UTILIZADO } from "@/lib/constants/strings";
import { api } from "@/lib/axios/api";
import { removeCookies, verifyToken } from "@/utils/authUtils";
import { redirect } from "next/navigation";
import { SIGN_IN } from "@/lib/constants/routes";
import { Router } from "next/router";

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