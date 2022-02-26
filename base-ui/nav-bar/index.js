// base-ui/nav-bar/index.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        rightText:{
            type:String,
            value:''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusBarHeight:20,
        navHeight:0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        handBack(){
            this.triggerEvent('click')
        }
    },
    lifetimes:{
        attached(){
            let {statusBarHeight , navHeight} = getApp().globalData
            if(!navHeight)navHeight = 44
            this.setData({
                statusBarHeight,
                navHeight
            })
        }
    }
})
