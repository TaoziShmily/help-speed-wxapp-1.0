var app = getApp();
import {apiRequest} from '../../utils/util';
Page({
	data:{
		Mask:false,
		code:''
	},
	// 获取用户信息
	bindgetuserinfo(res){
		var that = this;
		// 登录
	    wx.login({
	      success: res => {
	      	console.log('code1',res.code)
	      	var code = res.code
	      	that.setData({
	      		code:res.code
	      	})
	      	if(res.code){
	      		wx.getUserInfo({
					success:function(res){
						console.log('登录',res)
					    apiRequest('/i/weixinsiz/login','POST',{encryptedData:res.encryptedData,iv:res.iv,code:code},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
					    	console.log('登录1',res)
					    	if(res.statusCode == 200){
					    		if(res.data.state== 'success'){
					    			app.userInfo = res.data
						    		wx.setStorageSync('isAuthorize',true)
									wx.setStorageSync('userInfo',app.userInfo)
									wx.switchTab({
								        url: '/pages/index/index'
								    })
						    	}else{
						    		 wx.showModal({
									  title: '错误提示',
									  content: '请求授权登录接口出错',
									  showCancel:false,
									})
						    	}
					    	}
					    })
					},
					fail:function(err){
						that.setData({
							Mask:true
						})
					}
				})
	      	}
	      }
	    })	
	},
	// 在打开授权设置页后回调
	openSetting(res){
		var that = this;
		if(res.detail.authSetting["scope.userInfo"]){
			that.setData({
				Mask:false
			})
			if(that.data.code){
				wx.getUserInfo({
					success:function(res){
					    apiRequest('/i/weixinsiz/login','POST',{encryptedData:res.encryptedData,iv:res.iv,code:that.data.code},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
					    	if(res.statusCode == 200){
					    		if(res.data.state== 'success'){
					    			app.userInfo = res.data
						    		wx.setStorageSync('isAuthorize',true)
									wx.setStorageSync('userInfo',app.userInfo)
									wx.switchTab({
								        url: '/pages/index/index'
								    })
						    	}else{
								     wx.showModal({
									  title: '错误提示',
									  content: '请求授权登录接口出错',
									  showCancel:false,
									})
						    	}
					    	}
					    })
					},
					fail:function(err){
						that.setData({
							Mask:true
						})
					}
				})
			}
		}else{
		}
	},

	// 分享功能
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        console.log(res.target)
      }
      return {
        title: '速i助',
        path: '/pages/authorize/authorize'
      }
    }
})



