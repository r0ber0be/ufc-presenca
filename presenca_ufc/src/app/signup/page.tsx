'use client'

import React, { useState } from "react";
import { signUpWithEmailService, signUpWithGoogle } from "@/services/auth";
import { Box, Button, useToast } from "@chakra-ui/react";
import { SubmitHandler } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation'
import FormTemplate from "@/components/form";
import { FormValuesT } from "@/types/FormTypes";
import { DASHBOARD, SIGN_IN } from "@/lib/constants/routes";
import { ERRO_CADASTRO, TENTE_NOVAMENTE } from "@/lib/constants/strings";

export default function Signup() {
	const router = useRouter()
	const [isSubmmiting, setIsSubmmiting] = useState<boolean>(false);
	const [isGoogleSubmmiting, setIsGoogleSubmmiting] = useState<boolean>(false);
	const toast = useToast()

	const onSubmit: SubmitHandler<FormValuesT> = async data => {
		setIsSubmmiting(true)

		try {
			const res = await signUpWithEmailService(data)
			const { response, values } = res

			setIsSubmmiting(false)

			toast({
				position: 'top-right',
				title: values.title,
				description: values.description,
				status: values.status === 'success' ? 'success' : 'warning',
				duration: 3000
			})

			if(values.status=== 'success') {
				router.push(SIGN_IN)
			}
		} catch (error) {
			return
		}
	}

	const onClickSignUp = async() => {
		setIsGoogleSubmmiting(true)
		try {
			await signUpWithGoogle()
			router.push(DASHBOARD)
		} catch (error) {
			toast({
				position: 'top-right',
				title: ERRO_CADASTRO,
				description: TENTE_NOVAMENTE,
				status: 'warning',
				duration: 3000
			})
		} finally {
			setIsGoogleSubmmiting(false)
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
				isLoading={isGoogleSubmmiting}
				leftIcon={<FcGoogle/>} 
				onClick={onClickSignUp}>
					Cadastre-se com o Google
			</Button>
		</Box>
	)
}