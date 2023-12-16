import "dotenv/config"
import axios from "axios"
import redis from "./redis.js"
import { oauthUrl, openUrl } from "../config.js"

// import { client as webClient } from "websocket"
const auth = async () => {
  try {
    const url = oauthUrl as string
    const res = await axios.post(url, {
      appId: process.env.APP_ID,
      clientSecret: process.env.APP_SECRET,
    })
    if (res.status === 200) {
      await redis.connect()
      await redis.set(
        "qq_boot_token",
        res.data.access_token,
        res.data.expires_in
      )
      await redis.close()
      return res.data.access_token
    }
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status)
      // console.log(error.response.status)
      // console.log(error.response.headers)
    }
  }
}

export const getToken = async () => {
  try {
    await redis.connect()
    const data = await redis.get("qq_boot_token")
    await redis.close()
    if (data) {
      return data
    } else {
      const token = await auth()
      return token
    }
  } catch (err) {
    console.error(err)
  }
}

interface obj {
  params?: any
  data?: any
}
export const openapi = async (
  url: string,
  type: string = "get",
  obj: obj = {}
) => {
  const token: string = await getToken()
  const src = openUrl as string
  const appid = src as unknown as number
  try {
    const { data } = await axios({
      url: src + url,
      method: type,
      params: obj.params ? obj.params : {},
      data: obj.data ? obj.data : {},

      headers: {
        Authorization: `QQBot ${token}`,
        "X-Union-Appid": appid,
      },
    })
    // console.log(data)
    return data
  } catch (error: any) {
    // console.log(error)
    if (error.response) {
      console.log(error.response.data)
      // console.log(error.response.status)
      // console.log(error.response.headers)
    }
    if (error.request) {
      // console.log(error.request)
    }
  }
}
