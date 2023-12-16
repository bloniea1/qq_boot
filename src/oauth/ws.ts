import { getToken, openapi } from "./oauth.js"
import WebSocket from "ws"
import { myGlobal } from "../config.js"

class WsClient {
  ws!: WebSocket
  time: number = 30000 // 心跳检测间隔
  timer!: NodeJS.Timeout
  s: number | null = null
  reN: number = 0
  reTime: number = 200
  t: number =
    0 |
    (1 << 30) |
    (1 << 29) |
    (1 << 28) |
    (1 << 27) |
    (1 << 26) |
    (1 << 12) |
    (1 << 10) |
    (1 << 9) |
    (1 << 1) |
    (1 << 0)
  constructor() {}

  async create() {
    try {
      const res = await openapi("/gateway")
      if (res.url) {
        this.ws = new WebSocket(res.url)
        this.ws.on("open", async () => {
          console.log("open")
          console.log("ws 开启")
          const token: string = await getToken()
          const obj = {
            op: 2,
            d: {
              token: `QQBot ${token}`,
              intents: this.t,
              shard: [0, 1],
              properties: {
                $os: "linux",
                $browser: "",
                $device: "",
              },
            },
          }

          this.ws.send(JSON.stringify(obj))
        })
        await this.mainFun()
      }
    } catch (error: any) {
      console.log(error)
    }
  }
  // 主要监听
  async mainFun() {
    this.ws.on("message", async (data) => {
      try {
        const d = JSON.parse(data.toString())
        console.log(d)
        if (d.t === "READY") {
          // await redis.connect()
          // await redis.set("qq_boot_session_id", d.d.session_id)
          // await redis.close()

          //  = d.d.session_id
          myGlobal.session_id = d.d.session_id
          console.log("鉴权通过")
          console.log(`发送第一次心跳 {op:1,d:null}`)
          const xt = JSON.stringify({ op: 1, d: this.s })
          this.ws.send(xt)
        }
        if (d.s) {
          this.s = d.s
        }
        if (d.t === "RESUMED") {
          this.reN = 0
          console.log("重连成功")
        }
        if (d.op === 11) {
          console.log("心跳成功")

          // clearTimeout(this.timer)
          // this.timer = setTimeout(() => {
          //   console.log(`心跳校验{'op':1,d:${this.s}}`)
          //   this.ws.send(JSON.stringify({ op: 1, d: this.s }))
          //   clearTimeout(this.timer)
          // }, this.time)
        }

        if (d.d.content == 5) {
          try {
            // console.log(1233113)
            await openapi(`channels/${d.d.channel_id}/messages`, "post", {
              data: { content: "123" },
            })
            // console.log(res)
          } catch (error) {
            // console.log("err", error)
          }
        }
      } catch (err) {
        // console.error(err)
      }

      // console.log("received: %s", data)
    })
    this.ws.on("close", async () => {
      try {
        console.log("连接关闭")

        this.reN++
        console.log(`重连尝试:${this.reN}`)

        const timer = setTimeout(async () => {
          await this.reconnect()
          clearTimeout(timer)
        }, this.reTime)
      } catch (error) {
        console.log(error, "close")
      }
    })
  }
  async on(event: any, cb: any) {
    switch (event) {
      case "error":
        this.ws.on("error", async (error) => {
          cb(error)
        })
        break
      case "message":
        this.ws.on("message", async () => {
          // console.log(data.toString())
        })
        break
      case "guild_messages":
        this.ws.on("message", async (data) => {
          const d = JSON.parse(data.toString())
          if (d.t === "MESSAGE_DELETE" || d.t === "MESSAGE_CREATE") {
            cb(d)
          }
        })
        break
      default:
        cb(new Error(`${event} does not exist`))
        break
    }
  }
  // 重连
  async reconnect() {
    try {
      const res = await openapi("/gateway")

      if (res.url) {
        if (!myGlobal.session_id || myGlobal.session_id === "undefined") {
          return this.create()
        }
        console.log(res.url)
        this.ws = new WebSocket(res.url)
        console.log(this.ws)
        // await redis.connect()
        // const session_id = await redis.get("qq_boot_session_id")
        // await redis.close()

        const token: string = await getToken()
        // console.log(session_id, token)
        const payload = {
          op: 6,
          d: {
            token: `QQBot ${token}`,
            session_id: myGlobal.session_id,
            seq: this.t,
          },
        }
        console.log(payload)
        this.ws.send(JSON.stringify(payload))
        await this.mainFun()
      } else {
        this.reconnect()
      }
    } catch (err) {
      console.error(err)
    }
  }
}

export const createWebsocket = async () => {
  const obj = new WsClient()
  await obj.create()
  return obj
}
export default WsClient
