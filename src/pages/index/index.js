//index.js
//index.js
const app = getApp();
import {apiRequest} from '../../utils/util';

let animationShowHeight = 300;
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
    showModalStatus: false,
    imageHeight: 0,
    imageWidth: 0,
    runAM:false,
    stat_view:''

  	},
    
    // 获取首页数据
    getData () {
        apiRequest('/i/iborrow/index?id=1313','POST',{},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
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
            console.log('无无isAuthorize')
            wx.redirectTo({
                url: '/pages/authorize/authorize',
            })
        }
        let that = this;
        wx.getSystemInfo({
          success: function (res) {
            animationShowHeight = res.windowHeight;
          }
        })
    },

    // 监听页面隐藏
    onHide:function(){
        this.setData({
            showModalStatus: false,
            runAM:false
        })
    },

      // 首页幻灯片跳转到h5
    goWebViewPage(e){
        console.log('e',e)
        var quick_iborrow_id = e.currentTarget.dataset.quick_iborrow_id;
        var jump_url = e.currentTarget.dataset.jump_url;
        var stat_view = e.currentTarget.dataset.stat_view;
        var userInfo = "";
        if(wx.getStorageSync('userInfo')){
            userInfo = wx.getStorageSync('userInfo')
        }
        // 点击记录足迹
        apiRequest('/i/weixinsiz/savehistory','POST',{quick_iborrow_id:quick_iborrow_id,user_id:userInfo.user_id},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
            console.log('记录',res)
        })

         // 曝光量
         wx.request({
          url: stat_view,
        }) 

        wx.navigateTo({
          url: '/pages/webView/webView?jump_url='+jump_url
        })
    },

    // 点击量
    postClickLog(e) {
        var jump_url = e.currentTarget.dataset.jump_url;
        var stat_view = e.currentTarget.dataset.stat_view;
        var quick_iborrow_id = e.currentTarget.dataset.quick_iborrow_id;
        var userInfo = "";
        if(wx.getStorageSync('userInfo')){
            userInfo = wx.getStorageSync('userInfo')
        }
        // 点击记录足迹
        apiRequest('/i/weixinsiz/savehistory','POST',{quick_iborrow_id:quick_iborrow_id,user_id:userInfo.user_id},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
            console.log('记录',res)
        })
        // 点击量
        wx.request({
          url: jump_url,
        }) 
        // 曝光量
        wx.request({
          url: stat_view,
        }) 
    },


    // 点击领取按钮统计曝光
    postClickLogTwo(e){
        console.log('点击领取按钮统计曝光',this.data.stat_view)
        wx.request({
          url: this.data.stat_view,
          success (res) {
            console.log('点击领取按钮统计曝光sss',res)
          }
        }) 
    },

    // 打开客服弹框
    openServiceMask: function (options) {
        console.log('options',options)
        var index = options.currentTarget.dataset.index;
        var quick_iborrow_id = options.currentTarget.dataset.quick_iborrow_id;
        var stat_view = options.currentTarget.dataset.stat_view;
        this.setData({
            stat_view:stat_view
        })
        // console.log('jump_url',jump_url,this.data.jump_url,)
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
            index:index,
            runAM:true
        })
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        console.log('this.animation',this.animation)
        animation.translateY(animationShowHeight).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true,
            
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 0)

  },

    // 关闭客服弹框
    hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation;
    animation.translateY(animationShowHeight).step()
    this.setData({
      animationData: animation.export(),
      runAM:false
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 300)
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
    },

    
})









