// 当前播放歌曲共享数据
import { HYEventStore } from 'hy-event-store'
import { getSongDetail, getSongLyric } from '../api/api_player'
import { audioContext } from './index'
import { formatSonText } from '../utils/formatSonText'
const currentPlaySong = new HYEventStore({
    state:{
        songs:{}, //歌曲信息·
        durationTime:'', //歌曲持续时间 
        textArr:[], // 歌词数组
        playModeIndex:0, // 播放模式
        playingName:0, //是否暂停0暂停

        currentIndex:0, //歌词下标 
        currentLyricText:'', //当前播放歌词
        currentTime:0, // 歌曲当前时间
        textscrollTop:0, //歌词滚动距离
    },
    actions:{
        getSonsText(ctx,id){
            getSongDetail(id).then((res)=>{
                ctx.songs = res.songs[0]
                ctx.durationTime = res.songs[0].dt
            })
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true
            audioContext.onCanplay(() => {
                audioContext.play()
            })
            this.dispatch('audioContetSetAttr')
        },
        // 获取歌词信息
        getSongLyric(ctx ,id){
            getSongLyric(id).then((res) => {
                let arr = formatSonText(res.lrc.lyric)
                // 根据当前时间向上查找
                ctx.textArr = arr
            })
        },
        audioContetSetAttr(ctx){
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
                    const currentLyricInfo = textArr[currentIndex]
                    ctx.currentLyricText = currentLyricInfo.text
                    ctx.currentIndex  = currentIndex
                    // this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
                }
                // 改变歌词滚动条位置
                let textscrollTop = currentIndex*30
                // this.setData({
                    ctx.currentTime= currentTime,
                    ctx.textscrollTop =textscrollTop
                // })
            })
        }

    }
})
export {currentPlaySong}