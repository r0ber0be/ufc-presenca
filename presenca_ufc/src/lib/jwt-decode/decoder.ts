import { cookies } from "next/headers"
import { jwtDecode } from "jwt-decode"
import { ProfessorT } from "@/types/Professor"

export async function getProfessor(): Promise<ProfessorT> {
  const token = (await cookies()).get('token-ufc')?.value

  if(!token) {
    throw new Error('Não autênticado!')
  }
  
  const professor: ProfessorT = jwtDecode(token)

  return professor
}