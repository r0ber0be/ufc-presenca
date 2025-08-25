'use client'

import { useRouter } from "next/navigation";
import { Box, Button, useToast } from "@chakra-ui/react";
import { DASHBOARD } from "@/lib/constants/routes";
import { TENTE_NOVAMENTE } from "@/lib/constants/strings";
import { googleAuthService } from "@/services/auth";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";

export default function GoogleAuthTemplate(props:{ title: string, googleButtonText: string, questionText: string, actionText: string, route: string}) {
  const [isGoogleSubmmiting, setIsGoogleSubmmiting] = useState<boolean>(false)
  const router = useRouter()
  const toast = useToast()

  const onClickSignUp = async() => {
    setIsGoogleSubmmiting(true)
		try {
			await googleAuthService()
			router.push(DASHBOARD)
		} catch (error) {
			toast({
				position: 'top-right',
				title: props.title,
				description: TENTE_NOVAMENTE,
				status: 'warning',
				duration: 3000
			})
		} finally {
      setIsGoogleSubmmiting(false)
    }
	}

  return (
    <>
      <Button 
				id='google-auth-button'
				variant='solid'
				padding={6}
				margin={2}
				colorScheme='gray'
        isLoading={isGoogleSubmmiting}
				leftIcon={<FcGoogle/>} 
				onClick={onClickSignUp}>
					{props.googleButtonText}
			</Button>

			<Box fontSize='medium' textColor='HighlightText'>
				{props.questionText} {` `}
				<Link href={{ pathname: props.route }} passHref>
					<Button
						color='blue.300'
						variant='link' fontSize='medium'
						fontWeight="bold"
						textDecoration="underline"
						_hover={{ color: 'blue.700' }}
						_focus={{ boxShadow: 'none' }}
					>
						{props.actionText}
					</Button>
				</Link>
			</Box>
    </>
  )
}