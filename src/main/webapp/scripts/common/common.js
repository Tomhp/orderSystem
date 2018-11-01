/**------ 显示提示窗口 ------*/
function showTipWin(status, message) {
	if(zuiMain.deviceType == 'web') {
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

