import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import Image from "next/image";
const GoogleAuthTemplate = dynamic(() => import('@/components/googleAuth'), { ssr: false })

type UnsignedPageProps = {
  bgImage: string,
  route: string,
  signError: string,
	googleTextButton: string,
	question: string,
	action: string
}

export default function UnsignedPage({
	bgImage,
	route,
	signError,
	googleTextButton,
	question,
	action
}: UnsignedPageProps) {
  return (
    <Box 
			minH="100vh" 
			display="flex" 
			bgImage={bgImage}
			bgSize='cover'
			bgRepeat='no-repeat'
			justifyContent="center" 
			alignItems="center" 
			flexDirection="column"
			textAlign="center"
		>
			<Box height={'30vh'} width={'170px'} pos={'relative'}>
				<Image src='/assets/icon.png' fill alt="Logo Ufc" 
					style={{ objectFit: 'contain' }} priority
					sizes="(max-width: 220px) 100vw, (max-width: 220px) 50vw, 33vw"
				/>
			</Box>
		
			<Box as='span' marginTop={8} marginBottom={4} color='white' fontSize='larger' fontWeight='500'>Bem vindo ao Presença UFC</Box>
			<GoogleAuthTemplate
				title={signError}
				googleButtonText={googleTextButton}
				questionText={question}
				actionText={action}
				route={route}
			/>
		</Box>
  )
}