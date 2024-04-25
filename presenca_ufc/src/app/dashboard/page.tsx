import ClassList from "@/components/classCardsList"
import { SIGN_IN } from "@/lib/constants/routes"
import Link from "next/link"

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