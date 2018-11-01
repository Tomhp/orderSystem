/**------ 主函数入口 ------*/
$(document).ready(function(){
	if('product' == didMain.env) {
		initWeiXinJsSdkData();
	}
	else {
		// 浏览器JS定位经纬度
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showCurrPosition);
		}
	}
	// 获取设备类型
	getMobileDeviceInfo();
});
/**------ 获取设备类型 ------*/
function getMobileDeviceInfo() {
	// 浏览器请求头信息
	var browerHeadStr = navigator.userAgent;
	if(isUndefined(browerHeadStr)) {
		didMain.deviceCode = browerHeadStr.substring(browerHeadStr.indexOf("(")+1, browerHeadStr.indexOf(")"));
	}
}
/**------ 初始化【微信JSSDK】数据 ------*/
function initWeiXinJsSdkData() {
	var weixinAppId = $("#weixinAppId").val();		// APP-ID
	var timestamp = $("#weiXinTimestamp").val();	// 时间戳
    var nonceStr = $("#weiXinNonceStr").val();		// 随机串
    var signature = $("#weiXinSignature").val();	// 签名
	wx.config({
      	debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      	appId: weixinAppId, // 必填，公众号的唯一标识
      	timestamp: timestamp, // 必填，生成签名的时间戳
      	nonceStr: nonceStr, // 必填，生成签名的随机串
      	signature: signature, // 必填，签名，见附录1
      	jsApiList: [
      		'checkJsApi',
	        'onMenuShareTimeline',
	        'onMenuShareAppMessage',
	        'onMenuShareQQ',
	        'onMenuShareWeibo',
	        'hideMenuItems',
	        'showMenuItems',
	        'hideAllNonBaseMenuItem',
	        'showAllNonBaseMenuItem',
	        'translateVoice',
	        'startRecord',
	        'stopRecord',
	        'onRecordEnd',
	        'playVoice',
	        'pauseVoice',
	        'stopVoice',
	        'uploadVoice',
	        'downloadVoice',
	        'chooseImage',
	        'previewImage',
	        'uploadImage',
	        'downloadImage',
	        'getNetworkType',
	        'openLocation',
	        'getLocation',
	        'hideOptionMenu',
	        'showOptionMenu',
	        'closeWindow',
	        'scanQRCode',
	        'chooseWXPay',
	        'openProductSpecificView',
	        'addCard',
	        'chooseCard',
	        'openCard'
      	]
	});
	// 通过微信获取Gps定位信息
	wx.ready(function() {
		getGpsInfoByWeiXin();
	});
}
/**------ 通过微信获取Gps定位信息 ------*/
function getGpsInfoByWeiXin() {
	if(didMain.deviceType == 'web') {
		return;
	}
	wx.getLocation({
        type : 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success : function(res) {
        	showTipWin(false, 'Gps定位刷新成功！');
        	if($(".longitude").length > 0) {
        		showWorkPushCardInfo(res);
        	}
        },
        cancel : function(res) {
            showTipWin(false, '用户拒绝授权获取地理位置！');
        }
    });
}
/**------ 浏览器JS定位显示结果 ------*/
function showCurrPosition(position) {
	if($(".longitude").val().length <= 0) {
		showWorkPushCardInfo(position.coords);
	}
}
/**------ 判断是否是PC浏览器 ------*/
function isPcBrower() {
    var userAgentInfo = navigator.userAgent;
    var Agents = [
    	"Android", 
    	"iPhone",
		"SymbianOS", 
		"Windows Phone",
		"iPad", 
		"iPod"
	];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

/**------ 设定时间格式化函数 ------*/
Date.prototype.format = function (format) {
	var args = {
		"M+": this.getMonth() + 1,
       	"d+": this.getDate(),
       	"h+": this.getHours(),
       	"m+": this.getMinutes(),
       	"s+": this.getSeconds()
	};
	if (/(y+)/.test(format))
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var i in args) {
		var n = args[i];
		if (new RegExp("(" + i + ")").test(format))
		format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
	}
	return format;
};

/**------ JS事件辅助处理机制 ------*/
function isUndefined(variable) {
	return typeof variable == 'undefined' || 
		$.trim(variable) == '' || $.trim(variable) == 'NULL' ? false : true;
}

/**------ 文本框 onfocus 事件的清空默认值-设置 ------*/
function clearTxtMsg(obj, val, cls)
{
	if(obj.val() == val)
	{
		obj.val('');
		obj.css("color", cls);
	}
}
/**------ 文本框 onblur 事件的设置默认值-清除 ------*/
function showTxtMsg(obj, val, cls)
{
	if(obj.val() == '')
	{
		obj.val(val);
		obj.css("color", cls);
	}
}
/**------ JQuery 限制文本框只能输入数字 ------*/
function canNumberIpt(objcls) {
	$("." + objcls).keyup(function(){
        $(this).val($(this).val().replace(/[^\d]/g,''));  
    }).bind("paste",function(){  //CTR+V事件处理    
        $(this).val($(this).val().replace(/[^\d]/g,''));     
    }).css("ime-mode", "disabled"); //CSS设置输入法不可用  
}
/**------ JQuery 限制文本框只能输入数字和小数点 ------*/
function canNumberPointIpt(objcls) {
	$("." + objcls).keyup(function(){
        $(this).val($(this).val().replace(/[^0-9.]/g,''));    
    }).bind("paste",function(){  //CTR+V事件处理    
        $(this).val($(this).val().replace(/[^0-9.]/g,''));     
    }).css("ime-mode", "disabled"); //CSS设置输入法不可用 
}

/**------ 显示提示窗口 ------*/
function showTipWin(status, message) {
	if(didMain.deviceType == 'web') {
		Etw.Msg.show({
			title: '提示',
			isHaveMask: status,
			skin: 'gray',
			content: message
		});
	}
	else {
		Etw.Msg.appWin(message);
	}
}

/**------ 显示提示窗口 ------*/
function getTextNotNull(value) {
	if(isUndefined(value)) {
		return value;
	}
	return '';
}









