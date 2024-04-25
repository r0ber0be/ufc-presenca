'use server'

import { api } from "@/lib/axios/api"
import { cookies } from "next/headers"

export async function verifyToken(idToken: string) {
  const response = await api.post('/api/verifytoken/professor', { idToken })
  console.log('resposta do backend:', response)
  const { data } = response
  const expiresIn = 24 * 60 * 60 * 7

  cookies().set({
    path: '/',
    name: 'token-ufc',
    value: data,
    maxAge: expiresIn,
  })
}

export async function removeCookies() {
  if(cookies().has('token-ufc')) {
    cookies().delete('token-ufc')
  }
}

export async function getCookies() {
  return cookies().get('token-ufc')?.value
}