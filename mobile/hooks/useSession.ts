import { jwtDecode } from "jwt-decode";

import { getToken, removeToken } from "@/hooks/useAuthToken";
import { removeStudentData } from "@/hooks/useStudentData";

type SessionTokenPayload = {
  exp?: number;
};

async function clearSession() {
  await Promise.all([removeToken(), removeStudentData()]);
}

export async function getValidSessionToken() {
  const token = await getToken();

  if (!token) {
    return null;
  }

  try {
    const payload = jwtDecode<SessionTokenPayload>(token);

    if (typeof payload.exp !== "number") {
      await clearSession();
      return null;
    }

    const isExpired = payload.exp * 1000 <= Date.now();

    if (isExpired) {
      await clearSession();
      return null;
    }

    return token;
  } catch {
    await clearSession();
    return null;
  }
}
