'use client'

import React, { useState } from "react";
import { signUpWithEmailService, signUpWithGoogle } from "@/services/auth";
import { Box, Button, useToast } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation'
import FormTemplate from "@/components/form";
import { DASHBOARD, SIGN_IN } from "@/lib/constants/routes";
import { FormValuesT } from "@/types/FormTypes";
 

export default function Signup() {
	const router = useRouter()
	const [isSubmmiting, setIsSubmmiting] = useState<boolean>(false);
	const toast = useToast()

	const onSubmit: SubmitHandler<FormValuesT> = async data => {
		setIsSubmmiting(true)

		let title = ''
		let description = ''
		let status = ''

		await signUpWithEmailService(data)
			.then(res => {
				const {response, values} = res
				title = values.title
				description = values.description
				status = values.status
				setIsSubmmiting(false)
			})
			.finally(() => {
				toast({
					position: 'top-right',
					title: title,
					description: description,
					status: status === 'success' ? 'success' : 'warning',
					duration: 3000
				})
				if(status=== 'success') {
					router.push(SIGN_IN)
				}
			})
	}

	const onClickSignUp = async() => {
		try {
			await signUpWithGoogle()
			router.push(DASHBOARD)
		} catch (error: any) {
			toast({
				position: 'top-right',
				title: 'Tente novamente!',
				description: 'Um erro inesperado ocorreu',
				status: 'warning',
				duration: 3000
			})
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
			<Box as='span' color='gray.600' fontSize='sm' fontWeight='500'>Ou</Box>
			<Button 
				variant='outline'
				colorScheme='gray' 
				leftIcon={<FcGoogle/>} 
				onClick={onClickSignUp}>
					Cadastre-se com o Google
			</Button>
		</Box>
	)
}