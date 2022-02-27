// pages/music-player/index.js
// import { getSongDetail, getSongLyric } from '../../api/api_player'
import { audioContext, currentPlaySong } from '../../store/index'
const playModeNames = ["order", "repeat", "random"]
// import { formatSonText } from '../../utils/formatSonText'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 歌曲部分数据
        songs: {},  //歌词信息对象
        durationTime: '', // 歌曲持续时间
        currentSon: 0, // 当前滑块距离
        currentTime: 0,
        playModeIndex:0,// 播放模式索引
        playModeName: "order",//播放名称
        playingName: "pause",  // 是否暂停

        isSliderChanging: false,
        textArr: [], // 歌词数组
        currentLyricIndex: 0,
        currentLyricText: '', // 当前歌词
        currentIndex: 0, //  当前歌词的index
        textscrollTop: 0,

        contentHeight: 0,
        aspectRatio: '', // 屏幕宽高比控制歌词是否显示
        current: 0  // 当前轮播图显示页面0 歌曲页

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBaseData(options.id)
        let { navHeight, statusBarHeight, screenHeight, aspectRatio } = getApp().globalData
        this.setData({
            contentHeight: screenHeight - statusBarHeight - navHeight,
            aspectRatio
        })
    },
    getBaseData(id) {
        // 发送请求获取当前播放歌曲信息和持续时间 
        currentPlaySong.dispatch('getSonsText', id , true)
        // 监听当前播放歌曲信息和持续时间
        currentPlaySong.onStates(['songs', 'durationTime'], ({ songs, durationTime }) => {
            if (songs) {
                this.setData({ songs })
            }
            if (durationTime) {
                this.setData({ durationTime })
            }
            // 发送歌词网络请求获取歌词信息
        })
        // currentPlaySong.dispatch('getSongLyric', id)
        // 歌词数组
        currentPlaySong.onState('textArr', (res) => {
            if (res.length) this.setData({ textArr: res })
        })
        // 歌词索引
        currentPlaySong.onState('currentIndex', (res) => {
            this.setData({ currentIndex: res })
        })
        // 滚动距离
        currentPlaySong.onState('textscrollTop', (res) => {
            this.setData({ textscrollTop: res })
        })
        // 歌词
        currentPlaySong.onState('currentLyricText', (res) => {
            this.setData({ currentLyricText: res })
        })
        // 当前时间
        currentPlaySong.onState('currentTime', (res) => {
            if (!this.data.isSliderChanging) {
                let currentSon = +res / this.data.durationTime * 100
                this.setData({ currentTime: res, currentSon })
            }
        })
        // 监听播放模式
        currentPlaySong.onState('playModeIndex', (res) => {
            let playModeName = playModeNames[res]
            this.setData({ playModeName, playModeIndex:res })
        })
        // 是否暂停
        currentPlaySong.onState('playingName', (res) => {
            this.setData({ playingName: res==0 ? "pause": "resume"  })
        })
    },
    // 改变歌词
    setupAudioContextListener() {
        audioContext.onCanplay(() => {
            audioContext.play()
        })
    },
    // 改变滚动条
    handleChangeSlide(e) {
        // 1.获取slider变化的值
        const value = e.detail.value

        // 2.计算需要播放的currentTIme
        const currentTime = this.data.durationTime * value / 100

        // 3.设置context播放currentTime位置的音乐
        audioContext.pause()
        audioContext.seek(currentTime / 1000)
        // 4.记录最新的sliderValue, 并且需要讲isSliderChaning设置回false
        this.setData({
            isSliderChanging: false,
            currentSon: e.detail.value
        })
    },
    handleChanging(event) {
        const value = event.detail.value
        const currentTime = this.data.durationTime * value / 100
        this.setData({ isSliderChanging: true, currentTime, currentSon: value })
    },
    handleBackBtnClick(){
        wx.navigateBack()
    }, 
    changeCurrnt(data) {
        this.setData({
            current: data.detail.current
        })
    },
    // 改变轮播图显示的当前页
    handleChageCurrnt(e) {
        this.setData({
            current: e.currentTarget.dataset.index
        })
    },
    // 改变播放模式
    handleModeBtnClick(){
        let playModeIndex = this.data.playModeIndex + 1
        if (playModeIndex === 3) playModeIndex = 0
        currentPlaySong.setState('playModeIndex',playModeIndex)
    },
    handlePause(){
        let target = this.data.playingName === 'pause' ? 1 : 0 // 0 播放
        if(target ==0){
            currentPlaySong.dispatch('songsPlay')

        }else {
            currentPlaySong.dispatch('songsPause')
        }
        currentPlaySong.setState('playingName',target)
    },
    // 下一首歌
    nextSongs(){
        currentPlaySong.dispatch('changeSong',1) // 1下一首 -1 上一首
    },
    preventSongs(){
        currentPlaySong.dispatch('changeSong',-1) // 1下一首 -1 上一首
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