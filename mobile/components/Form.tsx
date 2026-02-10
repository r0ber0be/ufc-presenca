import { useState } from "react";
import { Button, TextInput } from "react-native-paper";
interface FormProps {
  login: string;
  password: string;
  onLoginChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  actionText: string;
}

const Form = ({
  login,
  password,
  onLoginChange,
  onPasswordChange,
  isLoading,
  onSubmit,
  actionText,
}: FormProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isDisabled = isLoading || !login.trim() || !password.trim();

  const sanitizeText = (text: string) =>
    text
      .replaceAll(/\p{Extended_Pictographic}/gu, "")
      .replaceAll(/[<>"'`\\;]/g, "");

  return (
    <>
      <TextInput
        placeholder="Insira seu nome de usuário do SIGAA"
        mode="outlined"
        label="Usuário"
        value={login}
        onChangeText={(text) => onLoginChange(sanitizeText(text))}
        disabled={isLoading}
      />
      <TextInput
        placeholder="Insira sua senha do SIGAA"
        mode="outlined"
        label="Senha"
        value={password}
        secureTextEntry={!isPasswordVisible}
        onChangeText={(text) => onPasswordChange(sanitizeText(text))}
        disabled={isLoading}
        right={
          <TextInput.Icon
            icon={isPasswordVisible ? "eye-off" : "eye"}
            onPress={() => setIsPasswordVisible((current) => !current)}
          />
        }
      />
      <Button
        mode="contained"
        loading={isLoading}
        disabled={isDisabled}
        onPress={onSubmit}
      >
        {actionText}
      </Button>
    </>
  );
};

export default Form;
