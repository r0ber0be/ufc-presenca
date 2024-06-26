'use client'

import FormTemplate from "@/components/form";
import GoogleAuthTemplate from "@/components/googleAuth";
import { SIGN_UP } from "@/lib/constants/routes";
import { ERRO_FECHAR_POPUP, TENTE_NOVAMENTE } from "@/lib/constants/strings";
import { signInWithEmailService } from "@/services/auth";
import { FormValuesT } from "@/types/FormTypes";
import { Box, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";

export default function Signin() {
	const router = useRouter()
	const toast = useToast()

  const onSubmit: SubmitHandler<FormValuesT> = async data => {
		try {
			const userCredential = await signInWithEmailService(data)
			if(typeof userCredential !== 'string') {
				router.push('/dashboard')
			}
		} catch (error: any) {
			toast({
				position: 'top-right',
				title: error,
				description: TENTE_NOVAMENTE,
				status: 'warning',
				duration: 3000
			})
		}
	}

  return (
    <Box display='grid' justifyContent='center' textAlign='center'>
      <FormTemplate
        onSubmit={onSubmit}
        isSubmmiting={false}
        buttonText='Entrar'
        loadingText='Entrando'
      />
			<Box as='span' color='gray.600' fontSize='medium' fontWeight='500'>Ou</Box>

			<GoogleAuthTemplate
				title={ERRO_FECHAR_POPUP}
				googleButtonText='Entrar com o Google'
				questionText='Não possui uma conta?'
				actionText='Cadastre-se'
				route={SIGN_UP}
			/>
    </Box>
  )
}