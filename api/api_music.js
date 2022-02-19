import axios from '../servers/index'

export function getBanners() {
  return axios.get("/banner", {
    type: 2
  })
}
export function getSongMenu(cat="全部", limit=6, offset=0){
  return axios.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}