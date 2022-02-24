// app.js
App({
  onLaunch() {
      let data = wx.getSystemInfoSync()
      this.globalData.statusBarHeight = data.statusBarHeight
      this.globalData.screenHeight = data.screenHeight
      this.globalData.aspectRatio = data.screenHeight / data.screenWidth
  },
  globalData: {
    statusBarHeight:"",
    screenHeight:"",
    navHeight:44,
    aspectRatio:''
  }
})
