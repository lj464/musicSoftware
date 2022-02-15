import axios from '../servers/index'
export const musicApi = {
    getBaseData(offset, limit = 10) {
        return axios.get('/top/mv', {
            offset, 
            limit
        })
    }
}