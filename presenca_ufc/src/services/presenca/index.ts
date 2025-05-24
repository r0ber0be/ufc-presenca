
import { api } from "@/lib/axios/api"
import { getCookies } from "@/utils/authUtils"

//export async function diasDeAula() {
//  const token = await getCookies()
//  const diasDeAula = await api.get(`/api/presencas/aulas`, { 
//    headers: { 
//      Authorization: `Bearer ${ token }` 
//    }, 
//  }).catch((err) => { return err })
//  console.log(diasDeAula.data)
//  return diasDeAula.data
//}

export async function atualizarPresencas(changes: {}[]) {
  console.log('no index',changes)
  const token = await getCookies()
  const res = await api.post(`/api/presencas/alunos/atualizar`,
    changes,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
  )
  console.log(res)
}