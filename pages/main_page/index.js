const App = getApp();
var util = require('../../utils/util.js');
const navigationBarHeight = (getApp().diygwstatusBarHeight + 44) + 'px'

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
var tempFilePath;
var bmap=require('../../libs/bmap-wx/bmap-wx.js');
var wxMarkerData=[];
Page({
  /*data: {
    buttons:[
  {type:'button',url:App.renderUrl('clock_page','index'),title:``}
]
},*/

data: {
  ak:"qR3WZtHj8Pe0q3HFd4lkNjRIo8kO3l0O",    //填上你的APP ID 对应的百度地图API KEY
  markers:[],
  longitude:'',
  latitude:'',
  address:'',
  citiInfo:{}
},
start: function () {
  const options = {
    duration: 10000,
    sampleRate: 16000,
    numberOfChannels: 1,
    encodeBitRate: 96000,
    format: 'mp3',
    frameSize: 50,
  }
  recorderManager.start(options);
  recorderManager.onStart(() => {
    console.log('recorder start')
  });
  recorderManager.onError((res) => {
    console.log(res);
  })
},
pause: function () {
  recorderManager.onPause();
  console.log('recoder pause')
},
stop: function () {
  recorderManager.stop();
  recorderManager.onStop((res) => {
    this.tempFilePath = res.tempFilePath;
    console.log('recoder stop', res.tempFilePath)
    const { tempFilePath } = res
  })
},
play: function () {
  innerAudioContext.autoplay = true
  innerAudioContext.src = this.tempFilePath,
    innerAudioContext.onPlay(() => {
      console.log('start playback')
    })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })

},
upload: function(){
  const TempFilePath=res.tempFilePath
},


onLoad: function () {
  var that=this;
  var BMap= new bmap.BMapWX({
    ak:that.data.ak
  });
  var fail=function(data){
    console.log(data);
  };
  var success = function(data) {   
    console.log(data);  
    wxMarkerData = data.wxMarkerData;    
    that.setData({   
        markers: wxMarkerData,  
        latitude: wxMarkerData[0].latitude,  
        longitude: wxMarkerData[0].longitude,  
        address: wxMarkerData[0].address,  
        cityInfo: data.originalData.result.addressComponent  
    });  
    var time = util.formatTime(new Date());
    
    this.setData({
      time: time
    });
}   
BMap.regeocoding({   
    fail: fail,   
    success: success  
});
},

showDiygwToast(message){
  this.setData({
    toastitem: {
      isToast:true,
      menuWidth: '100%',
      menuPosition: 'Down',
      menuEffect: 'slide',
      effectType: 'In',
      message: message
    }
  });
},
closeDiygwWindow(e){
  let windowid = e.currentTarget.dataset.id;
	var json = {};
	json['windowhide' + windowid]=true;   
	this.setData(json)
},
showDiygwWindow(windowid,index,effects){
    var json = {};
    json['windowhide' + windowid] = false; 
    var effect = effects[index];
    if (effect.effect == "") { effect.effect='slideInUp';}
    if (effect.count == "0") { effect.count = 'infinite'; }
    let style = `-webkit-animation-name:${effect.effect};animation-name:${effect.effect};-webkit-animation-duration:${effect.duration};animation-duration:${effect.duration};-webkit-animation-delay:${effect.delay};animation-delay:${effect.delay};-webkit-animation-iteration-count:${effect.count}`;
  json['windoweffect' + windowid] = style;
  this.setData(json);
  index++;
  if (index < effects.length && effect.count !='infinite'){
    var that = this;    
    setTimeout(function () {
      if(effect.hide){
        json['windowhide' + windowid] = true;
        this.setData(json);
      }
      that.showDiygwWindow(windowid, index, effects);
    }.bind(this), (parseInt(effect.duration) + parseInt(effect.delay))*1000);
  }  
},
showModal(message) {
   App.WxService.showModal({
    	title: '友情提示',
    	content: message,
    	showCancel: !1,
   });
},
onShareAppMessage: function () {
},
onLoad(option) {
	if (option){
      this.setData({
         globalOption: option
      })
    }
},
onShow(){
},
navigateTo(e) {
  if (e.currentTarget.dataset.url.indexOf("__weui-popup") > 0){
    let url = e.currentTarget.dataset.url;
    let windowid = url.substring(0, url.indexOf("__weui-popup"));
    let effects = this.data['windoweffects' + url.substring(0, url.indexOf("__weui-popup"))];
    this.showDiygwWindow(windowid, 0, effects);  
  }else if (e.currentTarget.dataset.url=='/pages/actions/index'||e.currentTarget.dataset.url=='actions'){
    let dataset = e.currentTarget.dataset;
    var item = this.data[dataset.field][dataset.index]['menu'];
    item.effectType='In';
    item.isMenu = true;
    if (item.title) {
      if (!item.title.nodes) {
        App.WxParse.wxParse('actionsTitle', 'html', item.title, this, 5);
        item.title = this.data['actionsTitle'];
      }
      item.title = this.data['actionsTitle'];	      
    } else {
      item.title = ""
    }
    if(item.menuPosition=="Up"||item.menuPosition=="Down"){
    	item.menuWidth="100%"
    }
	          
    this.setData({
      actionitem: item
    })    
  }else if (e.currentTarget.dataset.url == 'closetoasts') {
    let menuPosition = this.data.toastitem.menuPosition;
    let menuDefaultPosition = menuPosition;
    if (menuPosition == 'Down') {
      menuPosition = 'Up';
    } else if (menuPosition == 'Up') {
      menuPosition = 'Down';
    }
    this.setData({
      'toastitem.effectType': 'Out',
      'toastitem.menuDefaultPosition': menuDefaultPosition,
      'toastitem.menuPosition': menuPosition
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        'toastitem.isToast': false
      });
    }.bind(this), 1000);
  }else if (e.currentTarget.dataset.url == 'closeactions'){
    let menuPosition = this.data.actionitem.menuPosition;
    let menuDefaultPosition = menuPosition;
    if (menuPosition=='Down'){
       menuPosition = 'Up';
    }else if (menuPosition == 'Up') {
       menuPosition = 'Down';
    }
    this.setData({
      'actionitem.effectType': 'Out',
      'actionitem.menuDefaultPosition': menuDefaultPosition,
      'actionitem.menuPosition': menuPosition
    })  
    var that = this;
    setTimeout(function () { 
      that.setData({
        'actionitem.isMenu': false
      });
    }.bind(this), 1000);
  }else{
     App.navigateTo(e.currentTarget.dataset.url, e.currentTarget.dataset);
  }
},
changemainpage_dont_disturb: function (e) {
	var checked = !e.currentTarget.dataset.checked;
    this.setData({
      swicthclz7: checked ?"weui-switch-checked":"",
      switchchecked7: checked
    }); 
},

goto_sleep(){
  wx.navigateTo({
    url: '../start_sleep/index',
  });
  wx.showToast({
    title: '晚安啦~祝美梦',
    icon: 'success',
  })
}

})
