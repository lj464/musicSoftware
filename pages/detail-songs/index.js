// pages/detail-songs/index.js
import { rankingStore } from '../../store/index'
import { getSongMenuDetail } from '../../api/music'
import { currentPlaySong} from '../../store/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: "",
        ranking: "",
        songInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const type = options.type
        this.setData({ type })
        if (type === "menu") {
            const id = options.id
            getSongMenuDetail(id).then(res => {
                this.setData({ songInfo: res.playlist })
            })
        } else if (type === "rank") {
            const ranking = options.ranking
            this.setData({ ranking })

            // 1.获取数据
            rankingStore.onState(ranking, this.getRankingDataHanlder)
        }
    },
    onUnload: function () {
        if (this.data.ranking) {
            rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
        }
    },
    // 设置播放列表
    handleSongList(e) {
        console.log(this.data.songInfo.tracks,'444444444')
        currentPlaySong.setState('songsList', this.data.songInfo.tracks)
        currentPlaySong.setState('songIndex', e.currentTarget.dataset.index)
    },
    getRankingDataHanlder: function (res) {
        this.setData({ songInfo: res })
    }
})