// pages/denglu/denglu.js
const app = getApp()
const AV = require('../../libs/av-core-min.js'); 
Page({
  data: {
    username: '',
    password: '',
  },
  
  inputUsername(e) {
    this.setData({
      username: e.detail.value,
    })
  },
  inputPassword(e) {
    this.setData({
      password: e.detail.value,
    })
  },
 
  register() {
    wx.navigateTo({
      url: "/pages/zhuce/zhuce"
    });
  },

login(){
  const {
    username,
    password,
  } = this.data;
  AV.User.logIn(username, password).then(function (loginedUser) {
    wx.switchTab({
      url: '../main_page/index' ,
    });
    wx.showToast({
      title: '登录成功',
      icon: 'success',
    })
    // 登录成功，跳转到message页面
  }, function (error) {
    alert(JSON.stringify(error));
  });
},
})
