// pages/home-music/index.js
import { musicApi } from '../../api/music'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        musiLists: [],
        name: "zs"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadMore()
    },
    async loadMore(first) {
        let len = this.data.musiLists.length
        wx.showLoading({
            title: '加载中',
        })
        let res = await musicApi.getBaseData(len)
        wx.hideLoading()
        if (res.hasMore) {
            if (first) {
                this.setData({
                    musiLists: this.data.musiLists.concat(res.data)
                })
            } else {
                this.setData({
                    musiLists: res.data
                })
            }
        }
    },
    jumpDetail(e){

        
        wx.navigateTo({
          url: `/pages/detail-video/index?id=${e.currentTarget.dataset.id}`,
        })
    },
    onReachBottom: async function () {
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: async function () {
        await this.loadMore(false)
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.loadMore(true)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})