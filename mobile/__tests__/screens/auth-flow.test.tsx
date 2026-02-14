import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

const mockReplace = jest.fn();

jest.mock("expo-router", () => ({
  __esModule: true,
  router: {
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
  },
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock("@/api/auth", () => ({
  __esModule: true,
  handleLogin: jest.fn(),
}));

jest.mock("@/api/registration", () => ({
  __esModule: true,
  handleRegistration: jest.fn(),
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    __esModule: true,
    SafeAreaView: ({ children }: { children: React.ReactNode }) => (
      <View>{children}</View>
    ),
  };
});

jest.mock("@/components/Form", () => {
  const React = require("react");
  const { TextInput, TouchableOpacity, Text, View } = require("react-native");

  return function MockForm(props: any) {
    return (
      <View>
        <TextInput
          testID="login-input"
          value={props.login}
          onChangeText={props.onLoginChange}
        />
        <TextInput
          testID="password-input"
          value={props.password}
          onChangeText={props.onPasswordChange}
        />
        <TouchableOpacity testID="submit-button" onPress={props.onSubmit}>
          <Text>{props.actionText}</Text>
        </TouchableOpacity>
      </View>
    );
  };
});

describe("Telas de autenticação", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("envia login com usuário tratado e executa callback de sucesso", async () => {
    const { handleLogin } = require("@/api/auth");
    const SignIn = require("@/app/sign-in").default;

    (handleLogin as jest.Mock).mockResolvedValue(undefined);

    const { getByTestId } = render(<SignIn />);

    fireEvent.changeText(getByTestId("login-input"), "aluno123   ");
    fireEvent.changeText(getByTestId("password-input"), "secret");
    fireEvent.press(getByTestId("submit-button"));

    await waitFor(() => expect(handleLogin).toHaveBeenCalledTimes(1));

    const payload = (handleLogin as jest.Mock).mock.calls[0][0];
    expect(payload.login).toBe("aluno123");
    expect(payload.password).toBe("secret");

    payload.onSuccess();
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("envia cadastro e navega para sign-in após sucesso", async () => {
    const { handleRegistration } = require("@/api/registration");
    const SignUp = require("@/app/sign-up").default;

    (handleRegistration as jest.Mock).mockResolvedValue(undefined);

    const { getByTestId } = render(<SignUp />);

    fireEvent.changeText(getByTestId("login-input"), "novoaluno   ");
    fireEvent.changeText(getByTestId("password-input"), "123456");
    fireEvent.press(getByTestId("submit-button"));

    await waitFor(() => expect(handleRegistration).toHaveBeenCalledTimes(1));

    const payload = (handleRegistration as jest.Mock).mock.calls[0][0];
    expect(payload.login).toBe("novoaluno");
    expect(payload.password).toBe("123456");

    payload.onSuccess();
    expect(mockReplace).toHaveBeenCalledWith("/sign-in");
  });
});
