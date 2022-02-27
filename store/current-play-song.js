// 当前播放歌曲共享数据
import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../api/api_player'
import { audioContext } from './index'
import { formatSonText } from '../utils/formatSonText'
const currentPlaySong = new HYEventStore({
    state: {
        songs: {}, //歌曲信息·
        durationTime: '', //歌曲持续时间 
        textArr: [], // 歌词数组
        playModeIndex: 0, // 播放模式
        playingName: 0, //是否暂停0暂停

        currentIndex: 0, //歌词下标 
        currentLyricText: '', //当前播放歌词
        currentTime: 0, // 歌曲当前时间
        textscrollTop: 0, //歌词滚动距离

        songsList: [], // 歌曲数组
        songIndex: 0, // 歌曲在数组中的索引
        songsId: '' // 歌曲ID
    },
    actions: {
        getSonsText(ctx, id, dcontinue = false) {
            // 判断是否为同一首歌
            if (dcontinue && ctx.songsId === id) {
                return
            }
            ctx.songsId = id
            // 清空上一首歌的内容
            ctx.currentIndex = 0, //歌词下标 
                ctx.currentLyricText = ''//当前播放歌词
            ctx.currentTime = 0// 歌曲当前时间
            ctx.textscrollTop = 0 //歌词滚动距离
            ctx.song = {} //歌曲信息·
            ctx.durationTime = ''//歌曲持续时间 
            ctx.textArr = [] // 歌词数组
            ctx.playModeIndex = 0 // 播放模式
            ctx.playingName = 0 //是否播放0
            this.dispatch('getSongLyric', id)
            getSongDetail(id).then((res) => {
                ctx.songs = res.songs[0]
                ctx.durationTime = res.songs[0].dt
            })
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true
            audioContext.onCanplay(() => {
                audioContext.play()
            })
        },
        // 获取歌词信息
        getSongLyric(ctx, id) {
            getSongLyric(id).then((res) => {
                let arr = formatSonText(res.lrc.lyric)
                // 根据当前时间向上查找
                ctx.textArr = arr
                this.dispatch('audioContetSetAttr')
            })
        },
        audioContetSetAttr(ctx) {
            audioContext.onTimeUpdate(() => {
                // 获取当前时间
                const currentTime = audioContext.currentTime * 1000
                // 设置滚动位置
                const sliderValue = currentTime / ctx.durationTime * 100
                ctx.currentSon = sliderValue
                // 3.根据当前时间去查找播放的歌词
                let textArr = ctx.textArr
                let i = 0
                for (; i < textArr.length; i++) {
                    const lyricInfo = textArr[i]
                    if (currentTime < lyricInfo.time) {
                        break
                    }
                }
                // 设置当前歌词的索引和内容
                const currentIndex = i - 1
                if (ctx.currentLyricIndex !== currentIndex) {
                    const currentLyricInfo = textArr[currentIndex] || {}
                    ctx.currentLyricText = currentLyricInfo?.text ? '' : currentLyricInfo.text
                    ctx.currentIndex = currentIndex
                    // this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
                }
                // 改变歌词滚动条位置
                let textscrollTop = currentIndex * 30
                // this.setData({
                ctx.currentTime = currentTime,
                    ctx.textscrollTop = textscrollTop
                // })
            })
            // 3.监听歌曲播放完成
            audioContext.onEnded(() => {
                this.dispatch("changeSong")
            })
        },
        // 执行暂停歌曲操作
        songsPause() {
            audioContext.pause()
        },
        songsPlay() {
            audioContext.play()
        },
        changeSong(ctx, data = 1) {
            let index = ctx.songIndex
            let refresh = false
            // 2.根据不同的播放模式, 获取下一首歌的索引
            switch (ctx.playModeIndex) {
                case 0: // 顺序播放
                    index = data === 1 ? index + 1 : index - 1
                    if (index === -1) index = ctx.songsList.length - 1
                    if (index === ctx.songsList.length) index = 0
                    break
                case 1: // 单曲循环
                    refresh = true
                    break
                case 2: // 随机播放
                    index = Math.floor(Math.random() * ctx.songsList.length)
                    break
            }
            // 3.获取歌曲
            let currentSong = ctx.songsList[index]
            // 记录最新的索引
            ctx.songIndex = index
            // 4.播放新的歌曲单曲循环或者不同歌曲
            if (ctx.songsId !== currentSong.id || refresh == true) {
                this.dispatch("getSonsText", currentSong.id)
                // this.dispatch("getSongLyric", currentSong.id)
            } else {
                // 避免随机播放下一首重复
                this.dispatch('changeSong', data)
            }
        }
    }
})
export { currentPlaySong }