
const app = getApp();
import {apiRequest} from '../../utils/util';

Page({
  data: {
    userInfo: {},
    Title:'我的足迹',
    list:[],
    index:0
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
              showCancel:false
          })
        })
    },
    // 页面加载
    onShow: function () {
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
            show: false,
            runAM: false
        })
    },
    // 打开客服弹框
    openServiceMask: function (options) {
        this.setData({
            index:options.currentTarget.dataset.index
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
        this.setData({
            show: false,
            runAM: false
        })
    },
})





















