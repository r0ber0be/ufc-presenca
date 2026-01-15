import { Storage } from "@plasmohq/storage"

const handler = async (req, res) => {
  const SERVER_SIDE_URL = process.env.PLASMO_PUBLIC_API_URL
  const storage = new Storage()

  try {
    const token = await storage.get("extension-token")

    const response = await fetch(`${SERVER_SIDE_URL}/turmas?type=extension`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    
    if (!response.ok) {
      throw new Error("Falha na autenticação com o servidor.")
    }

    const data = await response.json()

    await storage.set("classes", data)
    
    res.send({ success: true, classes: data })
  } catch (error) {
    res.send({
      success: false,
      error: error.message || "GET TEACHER CLASSES: Erro desconhecido."
    })
  }
}

export default handler