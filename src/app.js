//app.js
App({
    onLaunch: function () {
    	if(!wx.getStorageSync('isAuthorize')){
            wx.redirectTo({
                url: '/pages/authorize/authorize',
            })
        }
        wx.checkSession({
			success: function(){
				console.log('session_key 未失效')
				//session_key 未过期，并且在本生命周期一直有效
			},
			fail: function(){
				// session_key 已经失效，需要重新执行登录流程
				console.log('session_key 已失效')
				if(!wx.getStorageSync('isAuthorize')){
		            wx.redirectTo({
		                url: '/pages/authorize/authorize',
		            })
		        }
			}
		})
    },
    globalData: {
        userInfo: null,
        API_PATH:'https://api-dev.topeffects.cn'
    }
})