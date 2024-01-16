import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { FormValues } from "@/components/form";
import { auth } from "@/lib/firebase/config";

export async function signUpWithEmailService(data: FormValues) {
  const response = await createUserWithEmailAndPassword(auth, data.email, data.senha)
    .then(userCredential => {
      const user = userCredential.user
      console.log('user:', user)
      return user
    }).catch((error: any) => {
      let errorCode = error?.code
      return errorCode
    })

  let values = {
    title: '',
		description: '',
		status: ''
  }

  if(response === 'auth/email-already-in-use') {
    values.title = 'Email já cadastrado!'
    values.description = 'Este email já está sendo utilizado'
    values.status = 'warning'
  } else {
    values.title = 'Conta criada!'
		values.description = 'Você será redirecionado para a tela de login'
		values.status = 'success'
  }
  
  return { values, response }
}

export async function signUpWithGoogle() {
  const provider = new GoogleAuthProvider()
  await signInWithPopup(auth, provider)
}