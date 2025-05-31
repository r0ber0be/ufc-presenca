import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)
export { auth }

// o google recomenda adicionar um observer para verificar se há um usuário logado ou não 
onAuthStateChanged(auth, (user) => {
  if(user) {
    const uid = user.uid
    const userName =  user.displayName
    const email = user.email
    console.log('Logado', userName, email, uid, user)
    if(user.emailVerified) {
      console.log('Email verificado')
    } else {
      console.log('Email não verificado')
    }
  }
  else {
    console.log('Deslogado')
  }
})
