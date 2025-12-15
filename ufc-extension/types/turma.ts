type CronogramaItem = {
  dia: string
  horario: string
}

export type SemestreInfo = {
  atual: string,
  inicio: string,
  fim: string
}

export type TurmaData = {
  capacidadeDeAlunos: number,
  codigo: string,
  cronograma: CronogramaItem[],
  semestre: SemestreInfo,
  local: string,
  nome: string,
  quantidadeDeAlunos: number
}