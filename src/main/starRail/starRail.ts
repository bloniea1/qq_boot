import { starRailUrl } from "../../config.js"
import { sendMessageApi } from "../../openapi/cliend.js"
import { getPathApi } from "./starRailApi.js"
// import { Wrapper } from "enkanetwork.js"
export const starRailAtlas = async (data: any) => {
  const urlJson = await getPathApi()
  if (
    urlJson &&
    urlJson.role &&
    urlJson.relic &&
    urlJson.lightcone &&
    urlJson["guide for role"]
  ) {
    const objJson = {
      ...urlJson.role,
      ...urlJson.relic,
      ...urlJson.lightcone,
    }

    const { content } = data
    const str: string = content.trim().replace(/\s+/g, "")
    const x: string = str.substring(0, 1)
    if (x !== "*") return
    const c = str.substring(1)
    if (!c.length) return
    const endC = c.slice(-2)
    if (endC === "攻略") {
      const gfc = c.slice(0, -2)
      if (gfc in urlJson["guide for role"]) {
        const dataRV = {
          image: `${starRailUrl}/${encodeURIComponent(
            urlJson["guide for role"][gfc]
          )}`,
        }
        await sendMessageApi(data.channel_id, dataRV)
      }
    } else {
      if (!(c in objJson)) return
      const dataRV = {
        image: `${starRailUrl}/${encodeURIComponent(objJson[c])}`,
      }
      await sendMessageApi(data.channel_id, dataRV)
    }
  }
}
export const starRailRole = async () => {
  // const { starrail } = new Wrapper({
  //   cache: true,
  //   language: "zh-CN",
  // })
  // starrail
  //   .getPlayer(113941976)
  //   .then((player: any) => {
  //     console.log(player.characters[0])
  //   })
  //   .catch((err) => console.log(err))
}
