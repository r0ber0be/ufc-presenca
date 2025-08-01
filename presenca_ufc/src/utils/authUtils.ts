'use server'

import { api } from "@/lib/axios/api"
import { cookies } from "next/headers"

export async function verifyToken(idToken: string) {
  const response = await api.post('/api/verifytoken/professor', { idToken })
  console.log('resposta do backend:', response)
  const { data } = response
  const expiresIn = 24 * 60 * 60 * 7

  ;(await cookies()).set({
    path: '/',
    name: 'token-ufc',
    value: data,
    maxAge: expiresIn,
  })
}

export async function removeCookies() {
  if((await cookies()).has('token-ufc')) {
    (await cookies()).delete('token-ufc')
  }
}

export async function getCookies() {
  return (await cookies()).get('token-ufc')?.value
}