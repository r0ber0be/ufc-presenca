import { SIGN_IN } from "@/lib/constants/routes"
import { auth } from "@/lib/firebase/config"
import { getProfessor } from "@/lib/jwt-decode/decoder"
import { logoutService } from "@/services/auth"
import Image from "next/image"
import Link from "next/link"

export default function Dashboard() {
  const { isSynced, name, sub, picture} = getProfessor()
  console.log(isSynced)
  return (
    <>
      <p>Hello, {name}</p>
      <Image src={picture} width={80} height={80} alt="" className="w-20 h-20 rounded-full" />
      <Link 
        href={SIGN_IN} >
          Sair
      </Link>
    </>
  )
}