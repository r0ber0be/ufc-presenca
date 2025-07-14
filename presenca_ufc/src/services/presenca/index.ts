
import { api } from "@/lib/axios/api"
import { getCookies } from "@/utils/authUtils"

export async function atualizarPresencas(changes: {}[], turmaId: string) {
  console.log('no index',changes)
  const token = await getCookies()
  const res = await api.post(`/api/presencas/alunos/${turmaId}/atualizar`,
    changes,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
  )
  console.log(res)
}