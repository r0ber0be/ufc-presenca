import { Button, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

export interface FormValues {
	email: string,
	senha: string
}

export default function FormTemplate(props:{ onSubmit:SubmitHandler<FormValues>, isSubmmiting: boolean, buttonText: String, loadingText: String }) {
	const { register, handleSubmit } = useForm<FormValues>();

  return (
		<form onSubmit={handleSubmit(props.onSubmit)} autoComplete="">
			<FormControl>
				<FormLabel htmlFor='email'>Email</FormLabel>
				<Input {...register('email', { 
									required: true,
									pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/
								})} 
								id='email' name='email' type='email' placeholder='Insira seu email' 
								autoComplete='email' />
				<FormErrorMessage>Eita, errei fui neymar</FormErrorMessage>
			
				<FormLabel htmlFor='senha'>Senha</FormLabel>
				<Input {...register('senha', { 
									required: true 
								})} 
								id='senha' name='senha' type='password' placeholder='Insira sua senha' 
								autoComplete='current-password' />
				<FormErrorMessage></FormErrorMessage>
				
				<Button 
					marginTop='1rem'
					loadingText={props.loadingText} 
					spinnerPlacement='end' 
					colorScheme='telegram' 
					type='submit' 
					isLoading={props.isSubmmiting}
				>
					{props.buttonText}
				</Button>
			</FormControl>
		</form>
	)
}