import nodeCron from 'node-cron'
import { markExpiredToken } from '../routines/markExpiredToken'

export function scheduleCloseExpiredLessons() {
  // *minuto *hora *dia do mês *mês *dia da semana
  // 22:00, de segunda à sexta
  nodeCron.schedule('0 22 * * 1-5', async () => {
    try {
      console.log('Rodando tarefa às 22h de segunda a sexta!')
      await markExpiredToken()
    } catch (error) {
      console.error('Erro ao exeutar tarefa:', error)
    }
  })
}
