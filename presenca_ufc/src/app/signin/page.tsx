'use client'

import { SIGN_UP } from "@/lib/constants/routes"
import { ERRO_FECHAR_POPUP } from "@/lib/constants/strings"
import { useEffect, useState } from "react"
import { changeBgByTime } from "@/utils/changeBgByTime"
import UnsignedPage from "@/components/unsignedPage"

const bgImageInitial = changeBgByTime()

export default function Signin() {
	const [bgImage, setBgImage] = useState(bgImageInitial)
	
	useEffect(() => {
		setBgImage(changeBgByTime())
	}, [])

  return (
		<UnsignedPage bgImage={bgImage} route={SIGN_UP} signError={ERRO_FECHAR_POPUP} googleTextButton='Entrar com o Google' question='Não possui uma conta?' action='Cadastre-se' />
  )
}