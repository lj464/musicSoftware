const BaseUrl = 'http://123.207.32.32:9001'

class ljAxios {
    request(url, method, params) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: BaseUrl + url,
                method,
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
    post(url, params) {
      return  this.request(url,'post',params )
    }
}
export default new ljAxios()
