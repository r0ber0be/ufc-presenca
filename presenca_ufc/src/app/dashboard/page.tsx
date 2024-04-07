import Header from "@/components/header"
import { SIGN_IN } from "@/lib/constants/routes"
import Link from "next/link"

export default function Dashboard() {
  return (
    <>
      <Header />
      <Link 
        href={SIGN_IN} >
          Sair
      </Link>
    </>
  )
}