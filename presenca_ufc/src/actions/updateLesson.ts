'use server'

import { getCookies } from '@/utils/authUtils'
import { api } from '@/lib/axios/api';

interface UpdateAulaParams {
  aulaId: string
  turmaId: string
  acceptPresenceByQRCode: boolean
}

interface UpdateAulaResult {
  success: boolean
  message?: string
  data?: any
}

export async function updateAulaPresenceStatus({ aulaId, turmaId, acceptPresenceByQRCode }: UpdateAulaParams): Promise<UpdateAulaResult> {
  console.log('updateAulaPresenceStatus', aulaId, turmaId)
  try {
    const token = await getCookies()

    if (!token) {
      return { success: false, message: 'Não autorizado.' };
    }

    const response = await api.patch(
      `/api/presencas/${turmaId}/${aulaId}/atualizar`,
      { acceptPresenceByQRCode },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return { success: true, data: response.data }

  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data?.message || `Erro no servidor: ${error.response.status}` }
    }
    return { success: false, message: 'Erro interno do servidor ao atualizar aula.' }
  }
}