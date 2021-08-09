const App = getApp();
const navigationBarHeight = (getApp().diygwstatusBarHeight + 44) + 'px'
Page({
data: {
          buttons3:[
				{type:'button',url:App.renderUrl('lightmusic','index'),title:``}
			],
     buttons5:[
				{type:'button',url:App.renderUrl('white_noise','index'),title:``}
			],
     buttons7:[
				{type:'button',url:App.renderUrl('before_sleep_stories','index'),title:``}
			]
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
