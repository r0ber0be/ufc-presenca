import { config } from 'dotenv'
import { env } from './config/env'
import app from './server'
config({ path: process.env.IS_TEST ? '.env.test' : '.env' })

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`Server is runnig on port ${address}`)
})
