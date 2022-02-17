import axios from '../servers/index'

export function getTopMV(offset, limit = 10) {
  return axios.get("/top/mv", {
    offset,
    limit
  })
}

/**
 * 请求MV的播放地址
 * @param {number} id MV的id
 */
export function getMVURL(id) {
  return axios.get("/mv/url", {
    id
  })
}

/**
 * 请求MV的详情
 * @param {number} mvid MV的id
 */
export function getMVDetail(mvid) {
  return axios.get("/mv/detail", {
    mvid
  })
}

export function getRelatedVideo(id) {
  return axios.get("/related/allvideo", {
    id
  })
}
