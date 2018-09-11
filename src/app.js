//app.js
App({
    onLaunch: function () {
    	//冷热启动
	    const updateManager = wx.getUpdateManager()
	    // 当向微信后台请求完新版本信息，会进行回调
	    updateManager.onCheckForUpdate(function (res) {
	      // 请求完新版本信息的回调
	      console.log(111,res.hasUpdate)
	    })
	    // 当新版本下载完成，会进行回调
	    updateManager.onUpdateReady(function () {
	      wx.showModal({
	        title: '更新提示',
	        content: '新版本已经准备好，是否重启应用？',
	        success: function (res) {
	          if (res.confirm) {
	            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
	            updateManager.applyUpdate()
	          }
	        }
	      })
	    })
	    // 当新版本下载失败，会进行回调
	    updateManager.onUpdateFailed(function () {
	    // 新的版本下载失败
	      wx.showModal({
	        title: '更新提示',
	        content: '新版本下载失败',
	        showCancel:false
	      })
	    })

    	// 获取是否授权状态
    	if(!wx.getStorageSync('isAuthorize')){
            wx.redirectTo({
                url: '/pages/authorize/authorize',
            })
        }
        // 检测登录态wx.checkSession
        wx.checkSession({
			success: function(){
				console.log('session_key 未失效')
				//session_key 未过期，并且在本生命周期一直有效
			},
			fail: function(){
				// session_key 已经失效，需要重新执行登录流程
				console.log('session_key 已失效')
				wx.removeStorageSync('isAuthorize')
				wx.removeStorageSync('userInfo')
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