import { config } from 'dotenv'
import { scheduleCloseExpiredLessons } from './jobs/closeExpiredLessons'
config({ path: process.env.IS_TEST ? '.env.test' : '.env' })

// eslint-disable-next-line import/first
import { env } from './config/env'
// eslint-disable-next-line import/first
import app from './server'

scheduleCloseExpiredLessons()

app.listen({ host: '0.0.0.0', port: env.PORT }, (err, address) => {
  if (err) {
    app.log.error({ err }, 'failed_to_start_server')
    process.exit(1)
  }
  app.log.info({ address }, 'server_running')
})
