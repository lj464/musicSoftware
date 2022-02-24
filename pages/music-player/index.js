// pages/music-player/index.js
import { getSongDetail, getSongLyric } from '../../api/api_player'
import { audioContext } from '../../store/index'
import { formatSonText } from '../../utils/formatSonText'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 歌曲部分数据
        songs: {},  //歌词信息对象
        durationTime: '', // 歌曲持续时间
        currentSon: 50,
        currentTime: 0,
        isSliderChanging: false,
        textArr: [], // 歌词数组
        currentLyricIndex:0,
        currentLyricText:'', // 当前歌词

        contentHeight: 0,
        aspectRatio: '' // 屏幕宽高比控制歌词是否显示
    

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
        getSongDetail(id).then(res => {
            this.setData({
                songs: res.songs[0],
                durationTime: res.songs[0].dt
            })
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true
            this.setupAudioContextListener()
        })
        getSongLyric(id).then((res) => {
            let arr = formatSonText(res.lrc.lyric)
            // 根据当前时间向上查找
            this.setData({
                textArr: arr
            })
        })
    },
    setupAudioContextListener() {
        audioContext.onCanplay(() => {
            audioContext.play()
        })
        audioContext.onTimeUpdate(() => {
            // 获取当前时间
            const currentTime = audioContext.currentTime * 1000
            // 获取总时间
            const sliderValue = currentTime / this.data.durationTime * 100
            if (!this.data.isSliderChanging) {
                this.setData({
                    currentSon: sliderValue,
                })
            }
            let textArr = this.data.textArr
            // 3.根据当前时间去查找播放的歌词
            let i = 0
            for (; i < textArr.length; i++) {
                const lyricInfo = textArr[i]
                if (currentTime < lyricInfo.time) {
                    break
                }
            }
            // 设置当前歌词的索引和内容
            const currentIndex = i - 1
            if (this.data.currentLyricIndex !== currentIndex) {
                const currentLyricInfo = textArr[currentIndex]
                this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
            }
            this.setData({
                currentTime: currentTime
            })
        })
    },
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