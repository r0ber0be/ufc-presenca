import { Storage } from "@plasmohq/storage"

const handler = async (req, res) => {
  const storage = new Storage()
  try {
    await storage.remove("extension-token")
    await storage.remove("classes")
    
    res.send({ success: true })
  } catch (error) {
    res.send({
      success: false,
      error: error.message || "DICONNECT: Erro desconhecido."
    })
  }
}

export default handler