import axios from '../servers/index'

export function getBanners() {
  return axios.get("/banner", {
    type: 2
  })
}