import { WeekDay } from '../../generated/client'

export function mapWeekday(raw: string) {
  const cleaned = raw.normalize('NFD').toLowerCase().trim()

  const map: Record<string, WeekDay> = {
    seg: WeekDay.SEG,
    ter: WeekDay.TER,
    qua: WeekDay.QUA,
    qui: WeekDay.QUI,
    sex: WeekDay.SEX,
  }

  const days = map[cleaned]

  if (!days) {
    throw new Error('Dia da semana inválido.')
  }
  return days
}
