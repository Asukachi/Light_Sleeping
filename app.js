//app.js
const AV = require('./libs/av-core-min');
const adapters = require('./libs/leancloud-adapters-weapp.js');

AV.setAdapters(adapters);
AV.init({
  appId: 'XOr6KkdsHEqn6mwJqtWzyIbC-gzGzoHsz',
  appKey: 'vPa2yei3YJCUhs2VQNdbrSua',
  // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
  serverURLs: "https://xor6kkds.lc-cn-n1-shared.com",
});


import polyfill from 'assets/plugins/polyfill'
import WxValidate from 'helpers/WxValidate'
import HttpService from 'helpers/HttpService'
import WxService from 'helpers/WxService'
import Tools from 'helpers/Tools'
import Session from 'helpers/Session'
import Config from 'config/config'
import WxParse from 'wxParse/wxParse'


App({
    onLaunch() {
    	this.checkVersion();
    },
    checkVersion(){
    	const updateManager = wx.getUpdateManager()

	    updateManager.onCheckForUpdate(function (res) {
	      // 请求完新版本信息的回调
	      console.log(res.hasUpdate)
	    })
	
	    updateManager.onUpdateReady(function () {
	      wx.showModal({
	        title: '更新提示',
	        content: '新版本已经准备好，单击确定重启应用',
	        showCancel: !1,
	        success(res) {
	          if (res.confirm) {
	            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
	            updateManager.applyUpdate()
	          }
	        }
	      })
	    })
	
	    updateManager.onUpdateFailed(function () {
	      // 新版本下载失败
	      wx.showModal({
	        title: "提示",
	        content: "检查到有新版本，但下载失败，请检查网络设置",
	        showCancel: !1
	      });
	    });
    },
    onShow() {
    },
    onHide() {
    },
    getUserInfo(cb) {
    
    	let openId = App.Session.getOpenId();

    
        if (this.globalData.userInfo) {
            return this.globalData.userInfo;
        } else {
            return this.WxService.login().then(data => {
                return this.WxService.getUserInfo();
            }).then(data => {
                this.globalData.userInfo = data.userInfo;
                return this.globalData.userInfo;
            })
        }
    },
    login(cb){
    	var thiz= this;
		let code;
		App.WxService.login().then(data => {
			console.log('wechatDecryptData', data.code);
			code = data.code;
			return App.WxService.getUserInfo();
		}).then(data => {
			return App.HttpService.wechatDecryptData({
				dashboardid:App.Config.dashboardid,
				encryptedData: data.encryptedData, 
				iv: data.iv, 
				rawData: data.rawData, 
				signature: data.signature, 
				code: code, 
				debug: App.Config.debug?"1":"0"
			})
		}).then(data => {
			if (data.code == 0) {
				App.Session.setUser(data);
				this.globalData.userInfo = data;
				typeof cb == "function" && cb(this.globalData.userInfo);
			} else{
	            App.WxService.showModal({
		            title: '友情提示', 
		            content: '获取用户登录状态失败，请重新登录', 
		            showCancel: !1, 
		        })
	        }
		})
    },
    globalData: {
        userInfo: null,
        tabBar:[],
        pages:["/pages/main_page/index","/pages/clock_page/index","/pages/clock_setpage/index","/pages/sleep_music/index","/pages/sleep_music_sorce/index","/pages/sleep_inside_music/index","/pages/sleep_lightmusic/index","/pages/sleep_whitenoise/index","/pages/sleep_stories/index","/pages/sleep_custom_sleepmusic/index","/pages/sleep_set_timing/index","/pages/statistics_mainpage/index","/pages/explore_mainpage/index","/pages/explore_article_push/index","/pages/explore_sleep_konwledge/index","/pages/explore_improve_sleep_quality/index","/pages/Analysis_of_sleep_process/index","/pages/Bad_sleep_habits/index","/pages/What_is_sleep_disorder/index","/pages/World_sleep_day/index","/pages/Why_snore/index","/pages/community/index","/pages/rank/index","/pages/Bind_home_users/index","/pages/Home_user_information/index","/pages/Add_home_user/index","/pages/forum_luntan/index","/pages/adminstrator/index","/pages/user_data/index"]
    },
    navigateTo(url,param){
    	if (url.startsWith("tel:")){
	        this.makePhoneCall(url);
	    } else if (url.trim().startsWith("map:")){
	        var urls = url.split(":");
	        const longitude = Number(urls[1]);
	        const latitude = Number(urls[2]);	       
	        wx.openLocation({
	          latitude,
	          longitude,
	          scale: 18
	        })
	    }else if (url.trim().startsWith("miniprogram:")){
	       var urls = url.split(":");
	       if(urls.length<2){
	         thiz.WxService.showModal({
		    	title: '友情提示',
		    	content:"请填写如:miniprogram:wx99fd0361f0c87b26",
		    	showCancel: !1,
		     });
	       }
	       var thiz=this;
	       var data = {
			  appId: urls[1],
			  fail(res){
		           if (res.errMsg.indexOf('fail appId')>=0){
		              res.errMsg = "请前往小程序设置小程序白名单：" + urls[1];
		           }
				   thiz.WxService.showModal({
				    	title: '友情提示',
             			content: res.errMsg,
				    	showCancel: !1,
				   });
			  },
			  success(res) {
			      // 打开成功
			  }
		   };
		   if(urls.length>=3){
		   		data.path = urls[2];	
		   } 
	       wx.navigateToMiniProgram(data)
	    }else{
	    	if (url.startsWith("http://")||url.startsWith("https://")){
	    		  this.WxService.navigateTo("/pages/webview/index", param);
	    	}else{
		    	if (!url.startsWith("/pages/")){
		    		   url="/pages/"+url+"/index";
		    	}
		        if (this.globalData.tabBar.indexOf(url) != -1) {
		            this.WxService.switchTab({
		                url: url
		            });
		        } else if(param && param['redirect']){             
	                this.WxService.redirectTo(url, param);
	            } else{
		          	this.WxService.navigateTo(url, param);
		        }
	    	}
	      	
	     }
    },
    renderUrl(url, defaultUrl) {
      if (!url || url=="") {
        url = defaultUrl;
      }
      if (url.trim().startsWith("miniprogram:")) {
         return url;
      }
      if (url.trim().startsWith("map:")) {
        return url;
      }
      if (url.indexOf("__weui-popup")>0||url.startsWith("tel:")||url.startsWith("http://")||url.startsWith("https://")) {
        return url;
      }
      if (url.indexOf("/pages/" + url) != 0) {
        url = "/pages/" + url + "/index";
      }
      return url;
    },
    renderImage(path) {
        if (!path) return ''
        if (path.indexOf('http') !== -1) return path
        return `${this.Config.fileBasePath}${path}`
    },
    renderBoolean(value){
    	if(value=="0"){
    		return false;
    	}
    	return value;
    },
    makePhoneCall: function(number) {
        if (number.currentTarget) {
            var dataset = number.currentTarget.dataset;
            number = dataset.number;
        }
        if(number.indexOf("tel:")!== -1){
        	number=number.substr(4);
        }
        wx.makePhoneCall({
            phoneNumber: number
        })
    },
    WxValidate: (rules, messages) => new WxValidate(rules, messages),
    HttpService: new HttpService,
    getActionUrl(url){
    	return this.HttpService.setUrl(url);
    },
    WxService: new WxService,
    Tools: new Tools,
    Session: Session,
    Config: Config,
    WxParse:WxParse
})
