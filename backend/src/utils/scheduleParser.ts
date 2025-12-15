import { mapWeekday } from '../helpers/sanitize/mapWeekday'

type CronogramaItem = {
  dia: string
  horario: string
}

export function buildSchedulesPayload(cronograma: CronogramaItem[]) {
  if (!cronograma || cronograma.length === 0) return []

  return cronograma.map((item) => {
    const [start, end] = item.horario.split('-')

    return {
      weekDay: mapWeekday(item.dia),
      startTime: start.trim(),
      endTime: end.trim(),
    }
  })
}
