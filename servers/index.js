const BaseUrl = 'http://123.207.32.32:9001'
const LOGIN_BASE_URL = "http://123.207.32.32:3000"
class ljAxios {
    constructor(BaseUrl){
        this.BaseUrl = BaseUrl
    }
    request(url, method, params,header) {
        return new Promise((resolve, reject) => {
            wx.request({
                url:  this.BaseUrl+ url,
                method,
                header,
                data: params,
                success(res){
                    resolve(res.data)
                },
                fail: reject
            })
        })
    }
    get(url, params,) {
       return this.request(url, 'get',params )
    }
    post(url, params,header={}) {
      return  this.request(url,'post',params,header )
    }
}
export default new ljAxios(BaseUrl)
const loginAxios =new ljAxios(LOGIN_BASE_URL)
export {loginAxios}
