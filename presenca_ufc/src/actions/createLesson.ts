'use server'

import { api } from '@/lib/axios/api'
import { getCookies } from '@/utils/authUtils'

export async function createLessonServerAction( turmaId: string, latitude: number, longitude: number) {
  try {
    const token = await getCookies()

    if (!token) {
      return { success: false, message: 'Não autorizado.' }
    }

    const backendResponse = await api.post(
      `/api/${turmaId}/aula`,
      {
        latitude,
        longitude
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    return { success: true, data: backendResponse.data }

  } catch (error: any) {
    console.error('Erro no Server Action (createLessonServerAction):', error.message || error)

    if (error.response) {
      return { success: false, message: error.response.data?.message || `Erro do backend: ${error.response.status}` }
    }

    return { success: false, message: 'Erro interno do servidor ao criar aula.' }
  }
}