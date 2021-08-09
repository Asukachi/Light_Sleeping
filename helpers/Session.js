var SESSION_KEY = 'user_session_diygw_com';
var REDIRECT_SESSION_KEY = 'redirect_session_diygw_com';

var Session = {
  getRedirecturl: function () {
    return wx.getStorageSync(REDIRECT_SESSION_KEY) || null;
  },

  setRedirecturl: function (url) {
    wx.setStorageSync(REDIRECT_SESSION_KEY, url);
  },
  getUser: function () {
    return wx.getStorageSync(SESSION_KEY) || null;
  },

  setUser: function (session) {
    wx.setStorageSync(SESSION_KEY, session);
  },

  clearUser: function () {
    wx.removeStorageSync(SESSION_KEY);
  },

  getToken: function (){
    var userInfo = this.getUser();
    return userInfo ? userInfo.token : null
  },

  getOpenId: function (){
    var userInfo = this.getUser();
    return userInfo ? userInfo.openid : null
  }
}

export default Session