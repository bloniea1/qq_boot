import { starRailUrl } from "../../config.js"
import axios from "axios"
interface obj {
  params?: any
  data?: any
}
const axiosRequest = async (
  url: string,
  method: string = "get",
  obj: obj = {}
) => {
  try {
    const { data } = await axios({
      url: starRailUrl + url,
      params: obj.params ? obj.params : {},
      data: obj.data ? obj.data : {},
      method: method,
    })
    return data
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.data)
      console.log(error.response.status)
      // console.log(error.response.headers)
    }
    if (error.request) {
      // console.log(error.request)
    }
  }
}
export const getPathApi = async () => {
  const res = await axiosRequest("/path.json", "get")
  return res
}
