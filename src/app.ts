import { createServer } from "./utils/server"

createServer()
.then(server => {
  server.listen(3000, () => {
    console.info(`Listening of http://localhost:3000`)
  })
})
.catch(err => {
  console.error(`Error: ${err}`)
})
