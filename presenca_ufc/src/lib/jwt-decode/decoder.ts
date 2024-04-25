import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"
import { ProfessorT } from "@/types/Professor"

export function getProfessor(): ProfessorT {
  const token =  cookies().get('token-ufc')?.value // talvez sem o ?.value tbm funcione, checar

  if(!token) {
    throw new Error('Não autênticado!')
  }
  const professor: ProfessorT = jwtDecode(token)

  return professor
}