// pages/zhuce/zhuce.js
const app = getApp()
const AV = require('../../libs/av-core-min.js'); 
Page({
  data: {
    username: '',
    password: '',
    sname: '',
    yearold: '',
    gen: '',
    shui: '',
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
  inputSname(e) {
    this.setData({
      sname: e.detail.value,
    })
  },
  inputYearold(e) {
    this.setData({
      yearold: e.detail.value,
    })
  },
  inputGen(e) {
    this.setData({
      gen: e.detail.value,
    })
  },
  inputShui(e) {
    this.setData({
      shui: e.detail.value,
    })
  },
 
  register() {
    const {
      username,
      password,
      sname,
      yearold,
      gen,
      shui,
    } = this.data;
    const user = new AV.User();
    if (username) user.set({username});
    if (password) user.set({password});
    if (sname) user.set({sname});
    if (yearold) user.set({yearold});
    if (gen) user.set({gen});
    if (shui) user.set({shui});
    user.save().then(() => {
      wx.showToast({
        title: '注册成功,返回登录',
        icon: 'success',
      });
    }).catch(error => {
      wx.showToast({
        title:'账户已存在',
        icon:'none'
      });
      wx.switchTab({
        url: '../denglu/denglu' ,
      });
    });
  },


})
