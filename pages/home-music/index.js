// pages/home-music/index.js
import { getBanners } from '../../api/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(queryRect, 1000)
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        swiperHeight: 145
    },
    // 设宽度
    handleSwiperImageLoaded() {
        throttleQueryRect('.swiper-image').then(res => {
            this.setData({
                swiperHeight: res[0].height
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPageData()
    },

    // 网络请求
    getPageData: function () {
        getBanners().then(res => {
            this.setData({ banners: res.banners })
        })
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
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})