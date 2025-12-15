import type { TurmaData } from "./turma"

export type TeacherPayload = {
  sub: string,
  name: string,
  picture?: string,
  isSynced: boolean,
  exp: number,
  iat: number
}

export type TeacherClass = {
  id: string
  nome: string
  codigo: string
  alunos: any[]
}

export type SigaaData = {
  nomeCompleto: string
  categoria: string
  turmas: TurmaData[]
}