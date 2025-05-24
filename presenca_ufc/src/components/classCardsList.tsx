'use server'

import { TurmaT } from "@/types/Turma";
import ClassCard from "./classCard";
import EmptyPage from "./emptyPage";
import { getCookies } from "@/utils/authUtils";
import { api } from "@/lib/axios/api";

export default async function ClassList() {
  const token = await getCookies()

  const response = await api.get(`/api/turmas`, { 
    headers: { 
      Authorization: `Bearer ${ token }` 
    }, 
  }).catch((err) => { 
    return err
  })

  const status = response.request.res?.statusCode
  if(status !== 200) {
    return <EmptyPage />
  }
  
  console.log(response.data)
  const turmas: Array<TurmaT> = response.data

  if(turmas.length === 0) {
    return <EmptyPage />
  }

  return (
    <>
      { turmas.map((turma) => (
          <ClassCard turma={ turma } key={ turma.id } />
        ))
      }
    </>
  )
} 