import { createClient } from "redis"
const redis = {
  client: createClient({
    password: "KmpJrasbvYEFLdcN0aGH6K9UKUjG4u1b",
    socket: {
      host: "redis-10500.c53.west-us.azure.redns.redis-cloud.com",
      port: 10500,
    },
  }),

  async connect() {
    await this.client.connect()
  },
  async set(key: string, value: string | number | object, time: number = 0) {
    if (typeof value === "object") {
      value = JSON.stringify(value)
    }
    if (time) {
      await this.client.set(key, value, {
        EX: time,
        NX: true,
      })
    } else {
      await this.client.set(key, value)
    }
  },
  async get(key: string) {
    const data = await this.client.get(key)
    try {
      if (data) {
        return JSON.parse(data)
      }
      return data
    } catch (error) {
      return data
    }
  },
  async ttl(key: string) {
    return await this.client.ttl(key)
  },

  async close() {
    await this.client.disconnect()
  },
}
export default redis
