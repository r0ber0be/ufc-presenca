import { env } from './config/env'
import app from './server'

app.listen({ port: env.PORT }, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`Server is runnig on port ${address}`)
})
