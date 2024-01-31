'use client'

import { DASHBOARD, SIGN_IN } from "@/lib/constants/routes"
import { auth } from "@/lib/firebase/config"
import { logoutService } from "@/services/auth"
import Link from "next/link"

export default function Dashboard() {
  const user = auth.currentUser?.displayName
  return (
    <>
      <p>Hello, {user}</p>
      <Link
        onClick={async() => await logoutService()}
        href={SIGN_IN}
      >Sair</Link>
    </>
  )
}