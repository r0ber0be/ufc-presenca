import Link from "next/link"
import dynamic from "next/dynamic"
import { SIGN_IN } from "@/lib/constants/routes"

const DynamicClassCardList = dynamic(() => import("@/components/classCardsList"))

export default function Dashboard() {
  return (
    <>
      <DynamicClassCardList />
      <Link 
        href={SIGN_IN} >
          Sair
      </Link>
    </>
  )
}