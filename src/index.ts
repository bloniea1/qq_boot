import { createWebsocket } from "./oauth/ws.ts"
import { starRailAtlas, starRailRole } from "./main/starRail/starRail.ts"
// export const ws = async () => {
const wsClient = await createWebsocket()
// return b
// }
const fun = [starRailAtlas, starRailRole]
const app = {
  async init() {
    wsClient.on("error", console.error)
    wsClient.on("guild_messages", async (data: any) => {
      Promise.all(fun.map((i) => i(data.d)))
    })
  },
}
export default app
