import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { FirebaseError } from "firebase/app";
import { FormValuesT } from "@/types/FormTypes";
import { CONTA_CRIADA, EMAIL_JA_CADASTRADO, EMAIL_EM_USO, REDIRECIONAR_PARA_LOGIN } from "@/lib/constants/strings";

export async function signUpWithEmailService(data: FormValuesT) {
  const response = await createUserWithEmailAndPassword(auth, data.email, data.senha)
    .then(userCredential => {
      const user = userCredential.user
      return user
    }).catch((error: FirebaseError) => {
      return error.code
    })

  let values = {
    title: '',
		description: '',
		status: ''
  }

  if(response === 'auth/email-already-in-use') {
    values.title = EMAIL_JA_CADASTRADO
    values.description = EMAIL_EM_USO
    values.status = 'warning'
  } else {
    values.title = CONTA_CRIADA
		values.description = REDIRECIONAR_PARA_LOGIN
		values.status = 'success'
  }
  
  return { values, response }
}

export async function signUpWithGoogle() {
  const provider = new GoogleAuthProvider()
  return await signInWithPopup(auth, provider)
}