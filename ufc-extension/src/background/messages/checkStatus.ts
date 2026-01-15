import { Storage } from "@plasmohq/storage"
import { jwtDecode } from "jwt-decode"
import type { TeacherPayload } from "types/teacher"

const handler = async (req, res) => {
  const storage = new Storage()
  try {
    const token = await storage.get("extension-token")

    if(!token) {
      res.send({ success: false, isConnected: false })
    }

    const payload = jwtDecode<TeacherPayload>(token)
    if (token) {
      if(payload.exp < Date.now()/1000) {
        await storage.remove("extension-token")
        await storage.remove("classes")
        res.send({ success: true, isConnected: false })
      }
      res.send({ success: true, isConnected: true, payload })
    } 
  } catch (error) {
    res.send({
      success: false,
      error: error.message || "CHECK STATUS: Erro desconhecido."
    })
  }
}

export default handler