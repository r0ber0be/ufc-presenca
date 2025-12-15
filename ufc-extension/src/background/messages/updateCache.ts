import { Storage } from "@plasmohq/storage"

const handler = async (req, res) => {
  const SERVER_SIDE_URL = process.env.PLASMO_PUBLIC_API_URL
  const storage = new Storage()

  try {
    const token = await storage.get("extension-token")

    if (!token) {
      return res.send({ success: false, error: "Usuário desconectado." })
    }

    const response = await fetch(`${SERVER_SIDE_URL}/turmas?type=extension`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    if (!response.ok) {
      if (response.status === 401) {
         await storage.remove("extension-token")
         await storage.remove("classes")
      }
      throw new Error(`Erro na API: ${response.status}`)
    }

    const freshData = await response.json()
    await storage.set("classes", freshData)

    res.send({ success: true, count: freshData.length })
  } catch (error) {
    res.send({
      success: false,
      error: error.message || "UPDATE CACHE: Erro desconhecido."
    })
  }
}

export default handler