'use client'

import dynamic from "next/dynamic"
import React, { useState } from "react"
import { signUpWithEmailService } from "@/services/auth"
import { SubmitHandler } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { Box, useToast } from "@chakra-ui/react"
import FormTemplate from "@/components/form"
import { FormValuesT } from "@/types/FormTypes"
import { DASHBOARD, SIGN_IN } from "@/lib/constants/routes"
import { ERRO_CADASTRO } from "@/lib/constants/strings"
const GoogleAuthTemplate = dynamic(() => import('@/components/googleAuth'), { ssr: true })

export default function Signup() {
	const router = useRouter()
	const toast = useToast()
	const [isSubmmiting, setIsSubmmiting] = useState<boolean>(false);

	const onSubmit: SubmitHandler<FormValuesT> = async data => {
		console.log('sending', data)
		setIsSubmmiting(true)

		try {
			await signUpWithEmailService(data)
			setIsSubmmiting(false)
			toast({
				position: 'top-right',
				title: 'values.title',
				description: 'values.description',
				status: 'success' === 'success' ? 'success' : 'warning',
				duration: 3000
			})
			router.push(DASHBOARD)
		} catch (error) {
			console.log(error)
			throw new Error('Não foi possível se cadastrar')
		}
	}

  return (
		<Box display='grid' justifyContent='center' textAlign='center'>
			<FormTemplate 
				onSubmit={onSubmit} 
				isSubmmiting={isSubmmiting} 
				buttonText='Criar conta' 
				loadingText='Cadastrando'
			/>
			<Box as='span' color='gray.600' fontSize='medium' fontWeight='500'>Ou</Box>
			<GoogleAuthTemplate
				title={ERRO_CADASTRO}
				googleButtonText='Cadastre-se com o Google'
				questionText='Possui uma conta?'
				actionText='Conecte-se'
				route={SIGN_IN}
			/>
		</Box>
	)
}