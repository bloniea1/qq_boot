import { sendMessageType } from "./messageType.js"
import { openapi } from "../oauth/oauth.js"
export const sendMessageApi = async (
  channel_id: number,
  data: sendMessageType
) => {
  const url = `/channels/${channel_id}/messages`
  const res = await openapi(url, "post", { data: data })
  return res
}
