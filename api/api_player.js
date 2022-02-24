import axios from '../servers/index'
export function getSongDetail(ids) {
    return axios.get("/song/detail", {
      ids
    })
  }
  export function getSongLyric(id) {
    return axios.get("/lyric", {
      id
    })
  }
  