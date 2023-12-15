import { createWebsocket } from "./oauth/ws.js"
import { starRailAtlas, starRailRole } from "./main/starRail/starRail.js"
// export const ws = async () => {

// return b
// }
const fun = [starRailAtlas, starRailRole]
const app = {
  async init() {
    const wsClient = await createWebsocket()
    wsClient.on("error", console.error)
    wsClient.on("guild_messages", async (data: any) => {
      // console.log(data)
      Promise.all(fun.map((i) => i(data.d)))
    })
    // wsClient.on("messages", async (data: any) => {})
  },
}
export default app
