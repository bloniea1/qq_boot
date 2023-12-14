export interface sendMessageType {
  content?: string
  embed?: MessageEmbed
  ark?: MessageArk
  message_reference?: MessageReference
  image?: string
  msg_id?: string
  markdown?: MessageMarkdown
}

interface MessageEmbed {
  title: string
  prompt: string
  thumbnail: MessageEmbedThumbnail
  fields: MessageEmbedField
}
interface MessageEmbedThumbnail {
  url: string
}

interface MessageEmbedField {
  name: string
}
interface MessageArk {
  template_id: number
  kv: Array<MessageArkKv>
}
interface MessageArkKv {
  key: string
  value: string
  obj: Array<MessageArkObj>
}

interface MessageArkObj {
  obj_kv: Array<MessageArkObjKv>
}
interface MessageArkObjKv {
  key: string
  value: string
}
interface MessageReference {
  message_id: number
  ignore_get_message_error: boolean
}
interface MessageMarkdown {
  template_id: number
  params: MessageMarkdownParams
  content: string
}
interface MessageMarkdownParams {
  key: string
  values: Array<string>
}
