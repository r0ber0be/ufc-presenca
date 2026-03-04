import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "ufcPresencaAluno";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token, {
    requireAuthentication: true,
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY, {
    requireAuthentication: true,
  });
}

export async function removeToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
