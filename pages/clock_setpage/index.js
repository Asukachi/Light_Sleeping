const App = getApp();
const navigationBarHeight = (getApp().diygwstatusBarHeight + 44) + 'px'
Page({
data: {
  array: ['1分钟', '5分钟', '10分钟', '15分钟','20分钟', '25分钟', '30分钟'],
  objectArray: [
    {
      id: 0,
      name: '1分钟'
    },
    {
      id: 1,
      name: '5分钟'
    },
    {
      id: 2,
      name: '10分钟'
    },
    {
      id: 3,
      name: '15分钟'
    },
    {
      id: 4,
      name: '20分钟'
    },
    {
      id: 5,
      name: 'w5分钟'
    },
    {
      id: 6,
      name: '30分钟'
    }
  ],
  mode:['轻松起床','强制起床'],
  time: '7:30',
  mHidden:true,
  index: '1',
  index_: '0'
},
btnTap:function(){
  this.setData({mHidden:false});
},
changeModel:function(){
  this.setData({mHidden:true});
},
modelCancel:function(){
  this.setData({mHidden:true});
},
bindPickerChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    index: e.detail.value
  })
},
bindPickerChange_: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    index_: e.detail.value
  })
},
bindTimeChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  this.setData({
    time: e.detail.value
  })
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
}

})
