import { HYEventStore } from 'hy-event-store'
import {getRankings} from '../api/music'
const rankingStore = new HYEventStore({
    state:{
        hotRanking:{}
    },
    actions:{
        async getRankingDataAction(ctx){
            let res = await getRankings(1)
            ctx.hotRanking = res.playlist
        }
    }
})
export default rankingStore