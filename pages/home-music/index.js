// pages/home-music/index.js
import { getBanners, getSongMenu } from '../../api/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'
import { rankingStore ,rankingMap ,currentPlaySong} from '../../store/index'

const throttleQueryRect = throttle(queryRect, 10) // 节流
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banners: [],
        swiperHeight: '',
        recommendSongs: [],
        hotSongMenu: [],
        recommendSongMenu: [],
        rankings: { 0: {}, 2: {}, 3: {} },

        // 音乐数据
        currentSong:{
        },
        playingName:0,
        currentTime:0,

    },
    // 设宽度
    handleSwiperImageLoaded() {
        throttleQueryRect('#swiper-image').then(res => {
            this.setData({
                swiperHeight: res[0].height
            })
        })
    },
    handlePlayBtnClick(){
        let target = this.data.playingName === 0 ? 1 : 0 // 0 播放
        if(target ==0){
            currentPlaySong.dispatch('songsPlay')
        }else {
            currentPlaySong.dispatch('songsPause')
        }
        currentPlaySong.setState('playingName',target)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getPageData()
        rankingStore.dispatch('getRankingDataAction')
        rankingStore.onState('hotRanking', (res) => {
            if (!res.tracks) return
            const recommendSongs = res.tracks.slice(0, 6)
            this.setData({ recommendSongs })
        })
        rankingStore.onState("newRanking", this.handleRank(0))
        rankingStore.onState("originRanking", this.handleRank(2))
        rankingStore.onState("upRanking", this.handleRank(3))
        // 获取英语数据
        this.getMusicData()
    },
    handleRank(idx) {
        return (res) => {
            if (Object.keys(res).length) {
                const name = res.name
                const coverImgUrl = res.coverImgUrl
                const playCount = res.playCount
                const songList = res.tracks.slice(0, 3)
                const rankingObj = { name, coverImgUrl, playCount, songList }
                const newRankings = { ...this.data.rankings, [idx]: rankingObj }
                this.setData({
                    rankings: newRankings
                })
            }
        }
    },
    handleRight() {
        this.navigateToDetailSongsPage("hotRanking")
    },
    navigateToDetailSongsPage(rankingName){
        wx.navigateTo({
            url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
          })
    },
    handleRankingItemClick: function(event) {
        const idx = event.currentTarget.dataset.idx
        const rankingName = rankingMap[idx]
        this.navigateToDetailSongsPage(rankingName)
      },
    // 网络请求
    getPageData: function () {
        getBanners().then(res => {
            this.setData({ banners: res.banners })
        })
        getSongMenu().then(res => {
            this.setData({ hotSongMenu: res.playlists })
        })

        getSongMenu("华语").then(res => {
            this.setData({ recommendSongMenu: res.playlists })
        })
    },
    getMusicData(){
        currentPlaySong.onState('songs',(songs)=>{
            this.setData({
                currentSong:songs
            }) 
        })
        currentPlaySong.onState('playingName',(playingName)=>{
            this.setData({
                playingName
            }) 
        })
        // 当前时间歌曲时间
        currentPlaySong.onState('currentTime', (res) => {
                this.setData({ currentTime: res })
        })
        currentPlaySong.onState('durationTime', (durationTime) => {
            this.setData({ durationTime })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    jumpSearch(){
        wx.navigateTo({
          url: '/pages/detail-search/index',
        })
    },
    handleSongItemClick(e){
        currentPlaySong.setState('songsList',this.data.recommendSongs)
        currentPlaySong.setState('songIndex',e.currentTarget.dataset.index)
    },
    jumpSong(){
        wx.navigateTo({
          url: '/pages/music-player/index?id='+this.data.currentSong.id,
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */

    /**
     * 生命周期函数--监听页面卸载1842025914
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