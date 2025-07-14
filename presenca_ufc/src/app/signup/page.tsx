'use client'

import React, { useEffect, useState } from "react"
import { SIGN_IN } from "@/lib/constants/routes"
import { ERRO_CADASTRO } from "@/lib/constants/strings"
import { changeBgByTime } from "@/utils/changeBgByTime"
import UnsignedPage from "@/components/unsignedPage"

const bgImageInitial = changeBgByTime()

export default function Signup() {
	const [bgImage, setBgImage] = useState(bgImageInitial)

	useEffect(() => {
		setBgImage(changeBgByTime())
	}, [])

  return (
		<UnsignedPage bgImage={bgImage} route={SIGN_IN} signError={ERRO_CADASTRO} googleTextButton='Cadastre-se com o Google' question='Possui uma conta?' action='Conecte-se' />
	)
}