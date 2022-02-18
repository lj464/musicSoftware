// pages/home-music/index.js
import { getBanners } from '../../api/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
import {rankingStore} from '../../store/index'
const throttleQueryRect = throttle(queryRect, 10) // 节流
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        swiperHeight: '',
        recommendSongs:[]
    },
    // 设宽度
    handleSwiperImageLoaded() {
        throttleQueryRect('#swiper-image').then(res => {
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
        rankingStore.dispatch('getRankingDataAction')
        rankingStore.onState('hotRanking',(res)=>{
            if (!res.tracks) return
            const recommendSongs = res.tracks.slice(0, 6)
            this.setData({ recommendSongs })
        })
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