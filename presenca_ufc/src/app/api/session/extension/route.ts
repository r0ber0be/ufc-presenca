'use server'

import { getCookies } from '@/utils/authUtils'
import { NextResponse } from 'next/server'

export async function GET() {
  const token = await getCookies()
  console.log("TOKEN", token)

  if(!token) {
    return NextResponse.json({ success: false, message: "Usuário não autenticado" }, { status: 401 })
  }

  return NextResponse.json({ success: true, token })
}