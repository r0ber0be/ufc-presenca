import { Storage } from "@plasmohq/storage"
import { jwtDecode } from "jwt-decode"
import type { TeacherPayload } from "types/teacher"

const handler = async (req, res) => {
  const storage = new Storage()
  const CLIET_SIDE_URL = process.env.PLASMO_PUBLIC_CLIENT_URL
  const SERVER_SIDE_URL = process.env.PLASMO_PUBLIC_API_URL

  try {
    const cookie = await chrome.cookies.get({
      url: CLIET_SIDE_URL,
      name: "token-ufc"
    })

    if (!cookie) {
      console.log("Background: Cookie 'token-ufc' não encontrado.")
      return res.send({
        success: false,
        error: "Por favor, faça login no UFC Presença novamente."
      })
    }

    const response = await fetch(`${SERVER_SIDE_URL}/professor/auth/extension`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.value}`,
      }
    })

    if (!response.ok) {
      throw new Error("Falha na autenticação com o servidor.")
    }

    const data = await response.json()

    const { token } = data
    if (!token) {
      throw new Error("Servidor não autenticou.")
    }

    await storage.set("extension-token", token)

    const payload = jwtDecode<TeacherPayload>(token)

    res.send({
      success: true,
      status: "Conectado",
      payload
    })

  } catch (error: any) {
    if(error instanceof TypeError) {
      res.send({
        success: false,
        error: "Não foi possível se comunicar com o servidor."
      })
    }
    console.log("CONNECT:", error)
    res.send({
      success: false,
      error: error.message || "CONNECT: Erro desconhecido."
    })
  }
}

export default handler