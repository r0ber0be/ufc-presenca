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
    console.log(err)
    process.exit(1)
  }
  console.log(`Server is runnig on port ${address}`)
})
