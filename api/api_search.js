import axios from '../servers/index'

export function getSearchHot() {
  return axios.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return axios.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}
