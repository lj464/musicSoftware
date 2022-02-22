// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest,getSearchResult } from '../../api/api_search'
import debounce from '../../utils/debounce'
import formarNode from '../../utils/formarNode'
const degetSearchSuggest = debounce(getSearchSuggest, 500)
Page({
  data: {
    hotKeywords: [],
    suggestSongs: [],
    searchValue: "",
    searchData: [],
    resultSongs:[]
  },
  onLoad: function (options) {
    // 1.获取页面的数据
    this.getPageData()
  },

  // 网络请求
  getPageData: function () {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },

  // 事件处理
  handleSearchChange: function (event) {
    // 1.获取输入的关键字
    const searchValue = event.detail

    // 2.保存关键字
    this.setData({ searchValue })
    this.setData({resultSongs:[]})
    // 3.判断关键字为空字符的处理逻辑
    if (!searchValue.length) {
      this.setData({ suggestSongs: [] })
      this.setData({ searchData: [] })
      return
    }

    // 4.根据关键字进行搜索
    degetSearchSuggest(searchValue).then(res => {
      // 如果输入框没有值则暂停操作
      if(!this.data.searchValue)return
      this.setData({ suggestSongs: res.result.allMatch })
      let textResult = res.result.allMatch.map(v => v.keyword)
      // 传入渲染字段数组和渲染字段
      let node = formarNode(textResult, this.data.searchValue)
      this.setData({
        searchData: node
      })
    })
  },
  // 热门搜索点击事件
  hotClick(e) {
    this.setData({
      searchValue: e.currentTarget.dataset.srarch
    })
    this.handleSearchAction()
  },
  handleSearchAction: function () {
    // 保存一下searchValue

    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({ resultSongs: res.result.songs })
    })
  },
  jumpSong() {
    wx.navigateTo({
      url: '/pages/music-player/index',
    })
  }
})