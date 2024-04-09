import ClassList from "@/components/classCardsList"
import Header from "@/components/header"
import { SIGN_IN } from "@/lib/constants/routes"
import Link from "next/link"

export default function Dashboard() {
  return (
    <>
      <Header />
      <ClassList />
      <Link 
        href={SIGN_IN} >
          Sair
      </Link>
    </>
  )
}