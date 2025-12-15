import { Storage } from "@plasmohq/storage"

const handler = async (req, res) => {
  const SERVER_SIDE_URL = process.env.PLASMO_PUBLIC_API_URL
  const storage = new Storage()

  try {
    const token = await storage.get("extension-token")
    if (!token) {
      throw new Error("Usuário não autenticado.")
    }

    // 'req.body' contém os dados recebidos do content
    const scrapedData = req.body

    if (!scrapedData) {
      throw new Error("Nenhum dado do SIGAA foi enviado.")
    }

    const response = await fetch(`${SERVER_SIDE_URL}/sync/turmas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(scrapedData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Falha na sincronização com o servidor.")
    }

    const data = await response.json()

    if (data.token) {
      await storage.set("extension-token", data.token)
    }

    res.send({ success: true, data: data })
  } catch (error) {
    res.send({
      success: false,
      error: error.message || "SYNC SIGAA DATA: Erro desconhecido."
    })
  }
}

export default handler