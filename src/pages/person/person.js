
const app = getApp();
import {apiRequest} from '../../utils/util';
let animationShowHeight = 300;
Page({
  data: {
    userInfo: {},
    Title:'我的足迹',
    list:[],
    index:0,
    sessionFrom:'',
    showModalStatus: false,
    imageHeight: 0,
    imageWidth: 0,
    runAM:false,
    jump_url:'',
    stat_view:''
  },
    // 获取足迹列表数据
    getData () {
        var userInfo = "";
        if(wx.getStorageSync('userInfo')){
            userInfo = wx.getStorageSync('userInfo')
        }
        apiRequest('/i/weixinsiz/history','POST',{user_id:userInfo.user_id},{'content-type':'application/x-www-form-urlencoded'}).then(res => {
            console.log('足迹列表',res)
          if (res.statusCode == 200) {
            this.setData({
                list:res.data,
                userInfo: wx.getStorageSync('userInfo') || []
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
          wx.showModal({
              title: '错误提示',
              content: '请求出错',
              showCancel:false
          })
        })
    },
    // 页面加载
    onShow: function () {
        let that = this;
        wx.getSystemInfo({
          success: function (res) {
            animationShowHeight = res.windowHeight;
          }
        })
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

    // 监听页面隐藏
    onHide:function(){
        this.setData({
            showModalStatus: false,
            runAM:false
        })
    },
    // 打开客服弹框
    openServiceMask: function (options) {
        console.log('打开客服弹框客服',options)
        this.setData({
            index:options.currentTarget.dataset.index,
            sessionFrom:options.currentTarget.dataset.sessionfrom,
            stat_view:options.currentTarget.dataset.stat_view,
            runAM:true
        })
        // 弹出客服Mask
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
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

    // 点击量
    postClickLog(e) {
        console.log('6666',e)
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
    postClickLogTwo(){
        console.log(99999,this.data.stat_view)
        wx.request({
          url: this.data.stat_view,
        }) 
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

    // 跳转到h5
    goWebViewPage(e){
        console.log('222222',e)
        var stat_view = e.currentTarget.dataset.stat_view;
        var jump_url = e.currentTarget.dataset.jump_url;
        wx.navigateTo({
          url: '/pages/webView/webView?jump_url='+jump_url
        })
        wx.request({
          url: stat_view,
        }) 
    },
})





















