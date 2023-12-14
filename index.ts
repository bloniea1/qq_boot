import client from "./src/index.js"
// import express from "express"
// const app = express()
// const port = 3001
// console.log(encodeURIComponent("/guide for role/玲可.png"))
client.init()
// app.get("/", (req: any, res: { send: (arg0: string) => void }) => {
//   res.send("Hello World!")
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// console.log(0 | (1 << 9) | (1 << 0))
// console.log(
//   0 |
//     (1 << 30) |
//     (1 << 29) |
//     (1 << 28) |
//     (1 << 27) |
//     (1 << 26) |
//     (1 << 12) |
//     (1 << 10) |
//     (1 << 9) |
//     (1 << 1) |
//     (1 << 0)
// )

import type { VercelRequest, VercelResponse } from "@vercel/node"

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.status(200).json({
    body: request.body,
    query: request.query,
    cookies: request.cookies,
  })
}
