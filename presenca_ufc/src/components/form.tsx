import { FormValuesT } from "@/types/FormTypes";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useForm, SubmitHandler } from "react-hook-form";

export default function FormTemplate(props:{ onSubmit:SubmitHandler<FormValuesT>, isSubmmiting: boolean, buttonText: String, loadingText: String }) {
	const { register, handleSubmit } = useForm<FormValuesT>();

  return (
		<form onSubmit={handleSubmit(props.onSubmit)} autoComplete="on">
			<FormControl>
				<FormLabel htmlFor='email'>Email</FormLabel>
				<Input {...register('email', { 
									required: true,
									pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/
								})} 
								id='email' name='email' type='email' placeholder='Insira seu email' 
								autoComplete='email'
				/>
			
				<FormLabel htmlFor='senha'>Senha</FormLabel>
				<Input {...register('senha', { 
									required: true 
								})} 
								id='senha' name='senha' type='password' placeholder='Insira sua senha' 
								autoComplete='current-password' 
				/>
				
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