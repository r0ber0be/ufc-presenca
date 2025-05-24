import Link from "next/link"
import ClassList from "@/components/classCardsList"
import { SIGN_IN } from "@/lib/constants/routes"

export default function Dashboard() {
  return (
    <>
      <ClassList />
      <Link 
        href={SIGN_IN} >
          Sair
      </Link>
    </>
  )
}