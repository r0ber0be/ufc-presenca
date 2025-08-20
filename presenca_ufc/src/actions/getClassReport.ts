'use server'

import { api } from '@/lib/axios/api'
import { getCookies } from '@/utils/authUtils'

export async function getClassReportServerAction(turmaId: string) {
  try {
    const token = await getCookies()

    if (!token) {
      return { success: false, message: 'Não autorizado.' }
    }

    const backendResponse = await api.get(
      `/api/${turmaId}/report`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return { success: true, data: backendResponse.data }

  } catch (error: any) {
    console.error('Erro no Server Action (getClassReportServerAction):', error.message || error)

    if (error.response) {
      return { success: false, message: error.response.data?.message || `Erro do backend: ${error.response.status}` }
    }

    return { success: false, message: 'Erro interno do servidor ao criar aula.' }
  }
}