// pages/start_sleep/index.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  back(){
    wx.switchTab({
      url: '../main_page/index',
    })
    wx.showToast({
      title: 'ιεΊζε',
      icon: 'success',
    })
  },
})