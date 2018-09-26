var app = getApp();
import {apiRequest} from '../../utils/util';
Page({
	data:{
		Mask:false,
		code:''
	},
	// 页面加载
	onLoad(){
		// 设置页面标题
		wx.setNavigationBarTitle({
			title:'授权登录',
		})
	},
	// 获取用户信息方法
	getUserInfo(res){
		console.log('登录')
		var that = this;
		// 登录
	    wx.login({
	      success: res => {
	      	var code = res.code
	      	console.log('code',code)
	      	that.setData({
	      		code:res.code
	      	})
	      	if(res.code){
	      		wx.getUserInfo({
					success:function(res){
						console.log('getUserInfo',res)
					    apiRequest('i/weixinsiz/login','POST',{encryptedData:res.encryptedData,iv:res.iv,code:code},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
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
      }
      return {
        title: '速i助',
        path: '/pages/authorize/authorize'
      }
    }
})



