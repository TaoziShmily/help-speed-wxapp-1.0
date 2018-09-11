//index.js
//index.js
const app = getApp();
import {apiRequest} from '../../utils/util';
Page({
 	data: {
    imgUrls: [],
    iborrow_title:'',
    Title:'推荐产品',
    list:[],
    index:0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    indicatorActiveColor:'#fff',
    show: false,
    runAM: false
  	},
    
    // 获取首页数据
    getData () {
        apiRequest('/i/iborrow/index?id=710','POST',{},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
            console.log('res',res)
          if (res.statusCode == 200 && res.data.status == "SUCCEED") {
            this.setData({
                imgUrls:res.data.topIborrows,
                iborrow_title:res.data.iborrow_title,
                list:res.data.listIborrows
            })
            wx.setNavigationBarTitle({
                title: res.data.iborrow_title || ''
            })
            if (wx.hideToast) {
                wx.hideToast();
            }
          } else {
            wx.showModal({
                title: '错误提示',
                content: '请求出错',
                showCancel:false
            })
          }
        }, res => {
            if (wx.hideToast) {
                wx.hideToast();
            }
            wx.showModal({
                title: '错误提示',
                content: '请求出错',
                showCancel:false
            })
        })
    },
    // 页面加载
    onLoad: function () {
        if (wx.showToast) {
            wx.showToast({
                title: '拼命加载中...',
                icon: 'loading',
                duration: 10000
            })
        }
        //更新数据
        this.getData();
    },

    // 再次加载页面，看是否缓存中有登陆状态，没有的话就跳转到授权登陆页进行授权
    onShow(){
        if(!wx.getStorageSync('isAuthorize')){
            wx.redirectTo({
                url: '/pages/authorize/authorize',
            })
        }
    },

    // 监听页面隐藏
    onHide:function(){
        this.setData({
            show: false,
            runAM: false
        })
    },

      // 首页幻灯片跳转到h5
    goWebViewPage(e){
        console.log('e',e)
        var quick_iborrow_id = e.currentTarget.dataset.quick_iborrow_id;
        var jump_url = e.currentTarget.dataset.jump_url;
        var userInfo = "";
        if(wx.getStorageSync('userInfo')){
            userInfo = wx.getStorageSync('userInfo')
        }
        // 点击记录足迹
        apiRequest('/i/weixinsiz/savehistory','POST',{quick_iborrow_id:quick_iborrow_id,user_id:userInfo.user_id},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
            console.log('记录',res)
        })
        wx.navigateTo({
          url: '/pages/webView/webView?jump_url='+jump_url
        })
    },

    // 点击量
    postClickLog(e) {
        console.log('点击量',e)
        var jump_url = e.currentTarget.dataset.jump_url;
        var quick_iborrow_id = e.currentTarget.dataset.quick_iborrow_id;
        var userInfo = "";
        if(wx.getStorageSync('userInfo')){
            userInfo = wx.getStorageSync('userInfo')
        }
        // 点击记录足迹
        apiRequest('/i/weixinsiz/savehistory','POST',{quick_iborrow_id:quick_iborrow_id,user_id:userInfo.user_id},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
            console.log('记录',res)
        })
        wx.request({
          url: jump_url,
        }) 
    },

    // 打开客服弹框
    openServiceMask: function (options) {
        console.log('options',options)
        var index = options.currentTarget.dataset.index;
        var quick_iborrow_id = options.currentTarget.dataset.quick_iborrow_id;
        var sessionFrom = options.currentTarget.dataset.sessionfrom;
        var userInfo = "";
        if(wx.getStorageSync('userInfo')){
            userInfo = wx.getStorageSync('userInfo')
        }
        // 点击记录足迹
        apiRequest('/i/weixinsiz/savehistory','POST',{quick_iborrow_id:quick_iborrow_id,user_id:userInfo.user_id,sessionFrom:sessionFrom},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
            console.log('记录',res)
        })
        // 弹出客服Mask
        this.setData({
            index:index
        })
        var isShow = this.data.show ? false : true;
        var delay = isShow ? 30 : 1000;
        if (isShow) {
            this.setData({
            show: isShow
        });
        } else {
            this.setData({
                runAM: isShow
            });
        }
    setTimeout(function () {
        if (isShow) {
            this.setData({
            runAM: isShow
        });
        } else {
                this.setData({
                    show: isShow
                });
            }
        }.bind(this), delay);
  },

    // 关闭客服弹框
    closeServiceMask(){
        // this.setData({
        //     show: false,
        //     runAM: false
        // })
        // var isShow = false;
        // // var runAM = false;
        // var delay = isShow ? 30 : 1000;
        // if (isShow) {
        //     this.setData({
        //     show: isShow
        // });
        // } else {
        //     this.setData({
        //         runAM: isShow
        //     });
        // }
        setTimeout(function () {
            if (isShow) {
                this.setData({
                runAM: isShow
            });
            } else {
                    this.setData({
                        show: isShow
                    });
                }
            }.bind(this), delay);
        },
    // 分享功能
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        console.log(res.target)
      }
      return {
        title: this.igame_title || '',
        path: '/pages/index/index'
      }
    }
})









