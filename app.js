// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from './api/api_login'
import { TOKEN_KEY } from './constants/token-const'
App({
  onLaunch: async function (){
    let data = wx.getSystemInfoSync()
    this.globalData.statusBarHeight = data.statusBarHeight
    this.globalData.screenHeight = data.screenHeight
    this.globalData.aspectRatio = data.screenHeight / data.screenWidth

    // 2.让用户默认进行登录
    const token = wx.getStorageSync(TOKEN_KEY)
    // token有没有过期
    const checkResult = await checkToken(token)
    // // 判断session是否过期
    const isSessionExpire = await checkSession()
    
    if (!token || checkResult.errorCode || !isSessionExpire) {
      this.loginAction()
    }
  },
  globalData: {
    statusBarHeight: "",
    screenHeight: "",
    navHeight: 44,
    aspectRatio: ''
  },
  loginAction: async function () {
    // 1.获取code
    const code = await getLoginCode()

    // 2.将code发送给服务器
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token)
  }
})
