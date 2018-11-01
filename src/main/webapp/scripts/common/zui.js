/*===========================================================
 * 说明：ZUI框架是构建简单灵活的PC后台系统架构，轻量级
 * 版本：V1.2
 * 作者：ZOUYONG
 * 日期：2016/10/26 
 * 许可信息：licenses（free-免费开源）
 ===========================================================*/

// ZUI主体对象
if(typeof zuiMain == 'undefined'){
	zuiMain = {};
}
// ZUI数据结果集合
if(typeof zuiMain.dataList == 'undefined') {
	zuiMain.dataList = {};
}
zuiMain.limit = 10;	// 默认每页显示数量
zuiMain.start = 0;  // 默认第一页

/**------ ZUI框架-入口函数 ------*/
$(document).ready(function(){
	// 初始化全局参数
	initZuiStaticParams();
	// 初始化框架变量
	initFrameZuiParams();
	// 加载主面板各类事件
	loadCenterPanelEvent();
	// 加载中间显示区域面板内容
	loadCenterShowData(null);
});

/**------ 初始化全局参数 ------*/
function initZuiStaticParams() {
	autoZuiDataListPanelSize();
};

/**------ 添加浏览器窗口大小改变事件 ------*/
$(window).resize(initZuiStaticParams);

/**------ 初始化框架变量 ------*/
function initFrameZuiParams() {
	if(!isZuiUndefined(zuiMain.contentPath)) {
		zuiMain.contentPath = "/";
	}
	if(!isZuiUndefined(zuiMain.deviceType)) {
		zuiMain.deviceType = "web"; // 默认为PC-WEB浏览器
	}
}

/**------ 加载主面板各类事件 ------*/
function loadCenterPanelEvent() {
	$(".menuOneLevel").click(function(){
		var obj = $(this);
		var cldMenuId = obj.attr("id") + 'MenuList';
		var menuOneIcon = obj.children('.menuOneIcon');
		if($("#"+cldMenuId).is(":hidden")) {
			$("#"+cldMenuId).show();
			obj.children('.menuOneIcon').removeClass('zk_icon');
			obj.children('.menuOneIcon').addClass('sh_icon');
			obj.removeClass('bkg_37424f');
			obj.addClass('bkg_22282E');
		} else {
			$("#"+cldMenuId).hide();
			obj.children('.menuOneIcon').removeClass('sh_icon');
			obj.children('.menuOneIcon').addClass('zk_icon');
			obj.removeClass('bkg_22282E');
			obj.addClass('bkg_37424f');
		}
	});
	$(".menuChilder li a").click(function(){
		loadCenterShowData($(this).attr("action"), $(this));
	});
};

/**------ 加载中间显示区域面板内容 ------*/
function loadCenterShowData(reqUrl, pressed, funcName) {
	// 默认加载第一个菜单的数据
	if(!reqUrl) {
		pressed = $(".menunode").first();
		reqUrl = pressed.attr("action");
	}
	if(reqUrl) {
		var loadReqUrl = '';
		if(reqUrl.indexOf('http') < 0) {
			loadReqUrl = zuiMain.contentPath;
		}
		loadReqUrl += reqUrl;
		$.post(
			loadReqUrl, 
			{},
			function(data) {
				$(".zuiCenter").html(data);
				if(funcName) {
					funcName();
				}
			}
		);
		// 修改点击菜单样式
		updateBtmMenuStyle(pressed);
	} else {
		showTipWin(false, '未找到菜单资源的URL[' + reqUrl + ']');
	}
};

/**------ 修改点击菜单样式 ------*/
zuiMain.selectMenuId = null;
function updateBtmMenuStyle(menuObj) {
	if(null != zuiMain.selectMenuId) {
		$('#'+zuiMain.selectMenuId).removeClass('bkg_37424f');
		$('#'+zuiMain.selectMenuId).addClass('bkg_22282E');
		$('#'+zuiMain.selectMenuId).addClass('menuHover');
	}
	zuiMain.selectMenuId = menuObj.attr('id');
	$('#'+zuiMain.selectMenuId).removeClass('bkg_22282E');
	$('#'+zuiMain.selectMenuId).addClass('bkg_37424f');
	$('#'+zuiMain.selectMenuId).removeClass('menuHover');
};

/**------ 对中间表格数据区域进行设置 ------*/
function autoZuiDataListPanelSize() {
	
	var zuiCenter = $(".zuiCenter");		// 主体面板对象
	var dataListDiv = $(".data_list_div");	// Table之上顶级对象
	var dataListOne = $(".data_list_one");	// Table之上父对象
	var dataListTab = $(".data_list_tab");	// Table对象
	var dataPageBar = $(".tabfotsm");		// 分页工具栏对象
	
	// 判断主体区域是否出现滚动条
	if(zuiCenter[0].scrollHeight > zuiCenter[0].clientHeight || zuiCenter[0].offsetHeight > zuiCenter[0].clientHeight) {
		if(dataListDiv.length > 0 && dataListDiv.is(":visible")) {
			var dataListOneHeight = dataListTab.height() + dataPageBar.height() + 7;
			// 处理如果出现横向滚动条
			if(dataListOne.hasClass("over-x")) {
				dataListOneHeight -= 21;
				dataListDiv.css({
					'height': dataListOneHeight + 48 + 'px'
				});
			}
			dataListOne.css({
				'height': dataListOneHeight + 'px'
				,'bottom': dataPageBar.height() + 'px'
			});
			dataPageBar.removeClass('tabfootcls');
			dataPageBar.addClass('tabfootclsfot');
		}
	}
	else {
		if(dataPageBar.length > 0 && dataPageBar.is(":visible")) {
			var dataListOneHeight = dataListTab.height();
			// 处理如果出现横向滚动条
			if(dataListOne.hasClass("over-x")) {
				dataListOneHeight += 18;
			}
			dataListOne.css({
				'height': dataListOneHeight + 'px'
			});
			dataPageBar.removeClass('tabfootclsfot');
			dataPageBar.addClass('tabfootcls');
		}
	}
	if(dataPageBar.length > 0 && dataPageBar.is(":visible")) {
		dataPageBar.css({
			'width': dataListDiv.width() + 'px'
		});
	}
}

/**------ Grid表格请求加载数据入口函数-start ------*/
function loadTableDataList(tabcls, reqUrl, pagecls, formcls, limit, start) {
	if(isZuiUndefined(reqUrl)) {
		
		// 以下代码是设置分页参数
		var params = '';
		if(!isZuiUndefined(limit)) {
			limit = zuiMain.limit;
		}
		params += 'limit='+limit;
		if(!isZuiUndefined(start)) {
			start = zuiMain.start;
		}
		params += '&start='+start;
		
		// 以下代码是设置请求url
		var loadReqUrl = '';
		if(reqUrl.indexOf('http') < 0) {
			loadReqUrl = zuiMain.contentPath;
		}
		if(isZuiUndefined(formcls) && $("."+formcls).length > 0) {
			params += '&' + $("."+formcls).serialize();
		}
		
		// 以下代码是处理【分页栏】事件
		if(isZuiUndefined(pagecls)) {
			if(!zuiMain.dataList[pagecls]) {
				zuiMain.dataList[pagecls] = {};
			}
			zuiMain.dataList[pagecls]['tabcls'] = tabcls;
			zuiMain.dataList[pagecls]['reqUrl'] = reqUrl;
			zuiMain.dataList[pagecls]['formcls'] = formcls;
		}
		
		// 设置数据Table集合
		zuiMain.dataList[tabcls] = {};
		// 表头对象
		var dataHeader = $("." + tabcls + " thead tr");
		// 获取Header各参数信息
		zuiMain.dataList[tabcls]['headerParams'] = getDataHeaderParams(dataHeader);
		// 设置正在加载区域
		dataBodyLoading(tabcls);
		
		loadReqUrl += reqUrl;
		$.ajax({
			type: 'POST',
			url: loadReqUrl,
			processData: true,
			data: params,
			success: function(callData) {
				$("." + tabcls).css({
					'height': 'auto'
				});
				var json = eval('(' + callData + ')');
				if(json && json.responseEntity) {
					eachAjaxData(tabcls, pagecls, json);
				}
			},
			error: function() {
				showTipWin(false, 'URL请求失败！'+reqUrl);
			}
		});
	}
	else {
		showTipWin(false, 'URL请求失败！'+reqUrl);
	}
}
/**------ Grid表格请求加载数据入口函数-end ------*/

/**------ 设置正在加载区域 ------*/
function dataBodyLoading(tabcls) {
	// Grid表体对象
	var dataTabBody = $("." + tabcls + " tbody");
	// Grid表体对象高度
	var dataTabBodyHeight = dataTabBody.height();
	if(dataTabBodyHeight < 100) {
		dataTabBodyHeight = 100;
	}
	dataTabBodyHeight += 44;
	// 清空Grid中数据
	$("." + tabcls + " tbody tr").remove();
	
	var dataTr = $('<tr></tr>');
	dataTr.appendTo(dataTabBody);
	var showColumn = zuiMain.dataList[tabcls]['headerParams'][2];
	var htmlLoading = 
		'<div class="mg_tp_10 wd_b_100 tl_ct">' + 
			// '<img src="'+zuiMain.contentPath+'statics/images/common/public/loading.gif" />' + 
			'<img src="https://statics.didong100.com/scripts/plugin/zui/1.2/image/loading.gif" />' + 
		'</div>';
	var dataTd= $("<td colspan='" + showColumn + "'>" + htmlLoading + "</td>");
	dataTd.appendTo(dataTr);
	$("." + tabcls).css({
		'height': dataTabBodyHeight + 'px'
	});
}

/**------ Grid表格数据请求成功后对数据进行处理-start ------*/
function eachAjaxData(tabcls, pagecls, jsonData) {
	// 数据列表对象
	var dataList = jsonData.responseEntity;
	// Grid表格对象
	var dataGrid = $("." + tabcls);
	// 表格总宽度
	var dataListTotalWidth = dataGrid.width();
	// 表体对象
	var dataTabBody = $("." + tabcls + " tbody");
	// 表格父对象高度值
	var tabPantHeight = 0;
	// 数据集合大小
	var dataLength = dataList.length;
	// 数据1：header对象
	var headAry = zuiMain.dataList[tabcls]['headerParams'][0];
	// 数据2：header实际宽度
	var headNowWidth = zuiMain.dataList[tabcls]['headerParams'][1];
	// 数据3：header实际显示列数
	var showColumn = zuiMain.dataList[tabcls]['headerParams'][2];
	
	// 是否生成横向滚动条
	if(getTableOverXByAttr(dataGrid)) {
		// 遍历Header对象
		var endTotalWidth = 0;
		$.each(headAry, function(n, params) {
			var currWidth = params.width;
			endTotalWidth += parseInt(currWidth);
			params.object.css({
				'width': currWidth + 'px'
			});
			params.width = currWidth;
		});
		if(endTotalWidth < dataListTotalWidth) {
			endTotalWidth = dataListTotalWidth;
		}
		dataGrid.css({
			'width': endTotalWidth + 'px'
		});
		dataGrid.parent().addClass("over-x");
	}
	
	// 清空Grid中body的数据
	$("." + tabcls + " tbody tr").remove();
	if(dataLength > 0 && headAry.length > 0) {
		for(var i=0; i<dataLength; i++) {
			var data = dataList[i];
			var dataId = tabcls+"-"+i; // new Date().format("yyyyMMddhhmmss");
			zuiMain.dataList[tabcls][dataId] = data;
			var dataTrId = randomString(8);
			var dataTr = $('<tr id="'+dataId+'" class="defa_bkg" onclick=selectRawData(\''+dataId+'\',\''+tabcls+'\')></tr>');
	        dataTr.appendTo(dataTabBody);
	        
			$.each(headAry, function(n, params) {
				var isHas = 0;
				// tr节点样式、tr下级th节点样式
				var trdModStyles = '';
				var trhDivStyles = '';
				// 列是否隐藏
				if(isZuiUndefined(params.hidden)) {
					trdModStyles = 'hidden="true"';
				}
				// 列宽
				var headWidth = params.object.width();
				if(isZuiUndefined(headWidth) && headWidth > 0) {
					trhDivStyles += 'width: ' + headWidth + 'px;';
				}
				// 列是否居中显示
				var align = params.align;
				if(isZuiUndefined(align)) {
					trhDivStyles += 'text-align: ' + align + ';';
				}
				// 列名
				var headName = params.name;
				// 处理【选择框】类型
				if(headName == 'checkbox') {
					var dataTd= $(
					'<td ' + trdModStyles + '>' + 
						'<div style="'+trhDivStyles+'" id="chb-' + dataId + '" number="' + dataId + 
							'" onclick=selectRawData(\''+dataId+'\',\''+tabcls+'\')' + 
							' class="small_icon_all unchecked isCkbx" single="'+params.single+'"></div>' + 
					'</td>'
					);
					dataTd.appendTo(dataTr);
				}
				// 处理【操作】类型
				else if(headName == 'zuiOper') {
					var text = '';
					var operarry = params.object.attr("operarry");
					// 格式：write[writeOpter, "修改", true, false]||remove[removeOpter, "删除", "", true]
					if(isZuiUndefined(operarry)) {
						// 正则表达式处理
						// var regn = /^.+?\[(.+?)\].*$/;
						// var icons = regn.exec(iconStr);
						
						var iconAry = operarry.split("||");
						for(var i=0; i<iconAry.length; i++) {
							var iconStr = iconAry[i];
							var contAry = iconStr.split("[");
							var icon = contAry[0];
							// 按钮类型
							var icons = contAry[1].replace("]", "");
							var valAry = icons.split(",");
							var len = valAry.length;
							var funs = len > 0 ? $.trim(valAry[0]) : '';		// 按钮回调函数
							var title = len > 1 ? $.trim(valAry[1]) : '';		// 按钮提示内容
							var isShow = len > 2 ? $.trim(valAry[2]) : '';		// 是否能显示
							var isClick = len > 3 ? $.trim(valAry[3]) : '';		// 是否能点击
							
							// 处理是否需要显示
							if(isZuiUndefined(isShow) && isShow != 'true') {
								if(isShow == 'false') {
									continue; // 不显示直接返回
								} else {
									try {
										if(!eval(isShow+"()")) {
											continue;
										}
									} catch(e) {}
								}
							}
							// 开始绘制
							text += setCellIconValue(icon, title, funs, data, isClick);
						}
					}
					var dataTd= $(
					'<td ' + trdModStyles + '>' + 
						'<div style="'+trhDivStyles+'">' + text + 
						'</div>' + 
					'</td>'
					);
					dataTd.appendTo(dataTr);
				}
				// 处理其他类型
				else {
					$.each(data, function(key, text) {
						if(key == headName) {
							if(isZuiUndefined(params.functName)) {
								text = eval(params.functName+"('"+text+"', data)");
							}
							if(!isZuiUndefined(text)) {
								text = '';
							}
							var prompt = params.prompt;
							var promptStr = '';
							if(isZuiUndefined(prompt)) {
								var promptText = text;
								if('this' != prompt) {
									promptText = eval(prompt+"('"+text+"', data)");
								}
								promptStr += '<div id="'+dataTrId+'_'+headName+'_prompt" ' + 
										'class="promptPanel br_rdu_5" style="display: none;">' +
										promptText + 
									'</div>'
								;
							}
							var dataTd= $(
								'<td ' + trdModStyles + ' onmouseover="showPromtPanel(\''+prompt+'\',\''+headName+'\',\''+dataTrId+'\')" ' + 
										' onmouseout="hidePromtPanel(\''+prompt+'\',\''+headName+'\',\''+dataTrId+'\')" >' + 
									'<div ' + 
										'class="tabTextDiv shengluohao" style="'+trhDivStyles+'">' + text + promptStr + 
									'</div>' +
								'</td>'
							);
							dataTd.appendTo(dataTr);
							isHas = 1;
							return false;
						}
					});
					// 补齐Table单元格
					if(isHas == 0) {
						var dataTd= $('<td ' + trdModStyles + '><div>&nbsp;</div></td>');
						dataTd.appendTo(dataTr);
					}
				}
			});
			
		}
	}
	else {
		var dataTr = $('<tr></tr>');
		dataTr.appendTo(dataTabBody);
		var nullDataHtml = 
			'<div class="mg_tp_30">' + 
				'<a class="dspy_blok wd_b_100 text_size_16 udf_h_100 tl_ct">' + 
					'<span class="frame_icon_all tipicon"><span>' + 
					'<span class="mg_lt_30">没有查询到符合条件的记录</span>' + 
				'</a>' + 
			'</div>';
		var dataTd= $("<td colspan='" + showColumn + "'>" + nullDataHtml + "</td>");
		dataTd.appendTo(dataTr);
		tabPantHeight += 100;
	}
	
	// Grid表格总高度，并设置Grid父节点高度
	var dataListTotalHeight = dataGrid.height();
	if(dataListTotalHeight <= 0) {
		dataListTotalHeight += parseInt(tabPantHeight);
	}
	$("." + tabcls).parent().css({
		'height': dataListTotalHeight + 'px'
	});
	
	// 处理分页数据
	handlerPageInfo(pagecls, jsonData);
	
	// 调整Grid及子元素高度及自适应
	autoZuiDataListPanelSize();
}
/**------ Grid表格数据请求成功后对数据进行处理-end ------*/

/**------ 显示提示信息 ------*/
function showPromtPanel(prompt, headName, dataTrId) {
	if(isZuiUndefined(prompt)) {
		var promptObj = $("#"+dataTrId+"_"+headName+"_prompt");
		// 是否隐藏
		if(promptObj.is(":hidden")) {
			promptObj.show();
		}
	}
}

/**------ 隐藏提示信息 ------*/
function hidePromtPanel(prompt, headName, dataTrId) {
	if(isZuiUndefined(prompt)) {
		var promptObj = $("#"+dataTrId+"_"+headName+"_prompt");
		// 是否可见
		if(promptObj.is(":visible")) {
			promptObj.hide();
		}
	}
}

/**------ 判断对象是否包含横向滚动条内嵌属性 ------*/
function getTableOverXByAttr(obj) {
	var overx = obj.attr('over-x');
	return isZuiUndefined(overx) && overx == 'true';
}

/**------ 在单元格内显示小图标-start ------*/
function setCellIconValue(icon, title, functName, data, isClick) {
	if(!isZuiUndefined(icon)) {
		return '';
	}
	if(!isZuiUndefined(title)) {
		title = '';
	}
	if(isZuiUndefined(isClick) && isClick != 'true') {
		if(isClick == 'false') {
			functName = '';
		} else {
			try {
				if(!eval(isClick+"()")) {
					functName = '';
				}
			} catch(e) {}
		}
	}
	// 处理是否需要显示
	var content = JSON.stringify(data);
	var clickStr = "onclick=getCellIconValue('"+content+"','"+functName+"')";
	// 返回
	return '<a ' + clickStr + 
			' class="small_icon_all '+icon+'_icon dspy_blok" title="'+title+'"></a>';
}
function getCellIconValue(data, functName) {
	// 阻止同一个事件多次执行
	stopevt();
	// 动态执行函数
	if(isZuiUndefined(functName)) {
		eval(functName+"('"+data+"')");
	}
}
/**------ 在单元格内显示小图标-end ------*/

/**------ 获取Header各参数信息-start ------*/
function getDataHeaderParams(dataHeader) {
	var headerParams = new Array();
	var headAry = new Array();
	var headerWidth = 0;
	var showColumn = 0;
	dataHeader.children().each(function(){
		// 列的宽度
		var width = $(this).attr("width");
		// 列的字段name属性值
		var name = $(this).attr('name');
		// 是否隐藏该列，只要有值则要隐藏
		var hidden = $(this).attr('hidden');
		// 该列显示的值，是否要执行函数查询
		var functName = $(this).attr('functName');
		// 该列是否支持鼠标放上去有提示框，如果值为this，则显示当前值；如果为其他值，则表示要执行该函数返回的数据
		var prompt = $(this).attr('prompt');
		// 是否居中、居左、居右
		var align = $(this).attr('align');
		// 单选或多选支持
		var single = $(this).attr('single');
		// 列宽
		if(!isZuiUndefined(width)) {
			width = 100; // 默认为100
		}
		headerWidth += parseInt(width);
		var params = {
			name: isZuiUndefined(name) ? name : '',
			hidden: isZuiUndefined(hidden) ? hidden : '',
			functName: isZuiUndefined(functName) ? functName : '',
			prompt: isZuiUndefined(prompt) ? prompt : '',
			align: isZuiUndefined(align) ? align : '',
			single: isZuiUndefined(single) ? single : '',
			width: width,
			object: $(this)
		};
		if(!isZuiUndefined(hidden)) {
			showColumn++;
		}
		if(isZuiUndefined(align)) {
			$(this).css({
				'text-align': align
			});
		}
		headAry.push(params);
	});
	// 数据1：header对象
	headerParams.push(headAry);
	// 数据2：header实际宽度
	headerParams.push(headerWidth);
	// 数据3：header实际显示列数
	headerParams.push(showColumn);
	
	return headerParams;
}
/**------ 获取Header各参数信息-end ------*/

/**------ 获取表格选择的数据列表 ------*/
function getTableSelectDataList(tabcls) {
	var dataList = new Array();
	$("." + tabcls + ' .isCkbx').each(function(){
		if($(this).hasClass('checked')) {
			var dataId = $(this).parent().parent().attr("id");
			var data = getTableRawData(tabcls, dataId);
			if(null != data) {
				dataList.push(data);
			}
		}
	});
	return dataList;
}

/**------ 获取选中的行对象数据 ------*/
function getTableRawData(tabcls, trId) {
	var res = null;
	$.each(zuiMain.dataList[tabcls], function(key, data) {
		if(key == trId) {
			res = data;
		}
	});
	return res;
}

/**------ 处理page分页信息-start ------*/
function handlerPageInfo(pagecls, jsonData) {
	// 总数
	var totalCount = jsonData.count;
	// 当前页码
	var start = jsonData.start;
	if(!isZuiUndefined(start) || start <= 0) {
		start = zuiMain.start; // 默认第一页
	}
	zuiMain.dataList[pagecls]['start'] = start;
	// 每页显示数量
	var limit = jsonData.limit;
	if(!isZuiUndefined(limit) || limit <= 0) {
		limit = zuiMain.limit; // 默认每页显示数量
	}
	zuiMain.dataList[pagecls]['limit'] = limit;
	// 当前页显示数量
	var currCount = jsonData.responseEntity.length;
	var totalPage = 0;
	if(totalCount%currCount != 0) {
		totalPage++;
	}
	totalPage += parseInt(totalCount/limit);
	// 当前页码
	zuiMain.dataList[pagecls]['currPage'] = zuiMain.dataList[pagecls]['start'] + 1;
	
	$("."+pagecls+" .pageBarPanel .totalCount").html(totalCount);
	$("."+pagecls+" .pageBarPanel .limitCount").html(zuiMain.dataList[pagecls]['limit']);
	$("."+pagecls+" .pageBarPanel .startCount").val(zuiMain.dataList[pagecls]['currPage']);
	$("."+pagecls+" .pageBarPanel .totalPage").html(totalPage);
	
	var tabcls = zuiMain.dataList[pagecls]['tabcls'];
	var reqUrl = zuiMain.dataList[pagecls]['reqUrl'];
	var formcls = zuiMain.dataList[pagecls]['formcls'];
	
	$("."+pagecls+" .startcls").unbind("click");
	$("."+pagecls+" .firstcls").unbind("click");
	$("."+pagecls+" .nextcls").unbind("click");
	$("."+pagecls+" .endcls").unbind("click");
	
	if(zuiMain.dataList[pagecls]['currPage'] != 1) {
		$("."+pagecls+" .startcls").click(function(){
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], 0);
		});
		updatePageBackCls(pagecls, "startcls", 0);
	}
	else {
		updatePageBackCls(pagecls, "startcls", 1);
	}
	if(zuiMain.dataList[pagecls]['start'] > 0) {
		$("."+pagecls+" .firstcls").click(function(){
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], zuiMain.dataList[pagecls]['start'] - 1);
		});
		updatePageBackCls(pagecls, "firstcls", 0);
	}
	else {
		updatePageBackCls(pagecls, "firstcls", 1);
	}
	if(zuiMain.dataList[pagecls]['start'] < totalPage-1) {
		$("."+pagecls+" .nextcls").click(function(){
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], zuiMain.dataList[pagecls]['start'] + 1);
		});
		updatePageBackCls(pagecls, "nextcls", 0);
	}
	else {
		updatePageBackCls(pagecls, "nextcls", 1);
	}
	if(zuiMain.dataList[pagecls]['currPage'] != totalPage) {
		$("."+pagecls+" .endcls").click(function(){
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], totalPage-1);
		});
		updatePageBackCls(pagecls, "endcls", 0);
	}
	else {
		updatePageBackCls(pagecls, "endcls", 1);
	}
}
function updatePageBackCls(pagecls, type, num) {
	if(1 == num) {
		$("."+pagecls + " ." + type).removeClass("enablePage");
		$("."+pagecls + " ." + type).addClass("disablePage");
	}
	else {
		$("."+pagecls + " ." + type).removeClass("disablePage");
		$("."+pagecls + " ." + type).addClass("enablePage");
	}
}
/**------ 处理page分页信息-end ------*/

/**------ 全选响应事件-start ------*/
function isSelectAll(tabcls, obj) {
	var ckbxs = $("." + tabcls + ' .isCkbx');
	var chbOne = $(ckbxs[0]);
	var single = ckbxs.length>0 ? chbOne.attr('single') : '';
	if(!isZuiUndefined(single)) {
		return;
	}
	var dataOneId = chbOne.attr('number');
	var objCkStatus = $(obj).hasClass('checked');
	if(objCkStatus) { // 已选择，则是取消选择
		ckbxs.each(function(){
			checkRawData($(this), $("#"+$(this).attr('number')), 1);
		});
		$(obj).removeClass('checked');
		$(obj).addClass('unchecked');
		return;
	}
	if('false' == single) {
		var isArdy = false;
		ckbxs.each(function(){
			if($(this).hasClass('checked')) {
				isArdy = true;
				return false;
			}
		});
		if(!isArdy) {
			checkRawData(chbOne, $("#"+dataOneId), 0);
		}
	}
	else {
		ckbxs.each(function(){
			checkRawData($(this), $("#"+$(this).attr('number')), 0);
		});
	}
	$(obj).removeClass('unchecked');
	$(obj).addClass('checked');
}
/**------ 全选响应事件-end ------*/

/**------ 点击选择某行-start ------*/
function selectRawData(dataId, tabcls) {
	// 阻止同一个事件多次执行
	stopevt();
	// start
	var chbObj = $("#chb-" + dataId);
	var ckStatus = chbObj.hasClass('checked');
	if(ckStatus) {
		checkRawData(chbObj, $("#"+dataId), 1);
		return;
	}
	var single = chbObj.attr('single');
	if('false' == single) {
		var isArdy = false;
		var ckbxs = $("." + tabcls + ' .isCkbx');
		ckbxs.each(function(){
			if($(this).hasClass('checked')) {
				isArdy = true;
				return false;
			}
		});
		if(!isArdy) {
			checkRawData(chbObj, $("#"+dataId), 0);
		}
	}
	else {
		checkRawData(chbObj, $("#"+dataId), 0);
	}
}
function checkRawData(chbObj, trObj, num) {
	if(0 == num) {
		chbObj.removeClass('unchecked');
		chbObj.addClass('checked');
		trObj.removeClass('defa_bkg');
		trObj.addClass('check_bkg');
	} else {
		chbObj.removeClass('checked');
		chbObj.addClass('unchecked');
		trObj.removeClass('check_bkg');
		trObj.addClass('defa_bkg');
	}
}
/**------ 点击选择某行-end ------*/

/**------ 重置表单，并且刷新（前提所有参数必须齐全） ------*/
function refreshTableDataList(formcls, tabcls, reqUrl, pagecls) {
	if(isZuiUndefined(formcls) && $("."+formcls).length > 0) {
		// 重置表单
		$("."+formcls)[0].reset();
		// 并且刷新Table
		if(isZuiUndefined(tabcls) && isZuiUndefined(reqUrl) && isZuiUndefined(pagecls)) {
			loadTableDataList(tabcls, reqUrl, pagecls, formcls);
		}
	}
}

// 必填项检查
function isCheckValNull(value, cls, title) {
	if($.trim(value).length <= 0) {
		$("." + cls).parent().removeClass('bdr_ipt');
		$("." + cls).parent().addClass('bdr_red');
		$("." + cls).parent().attr('title', title);
	} else {
		$("." + cls).parent().removeClass('bdr_red');
		$("." + cls).parent().addClass('bdr_ipt');
		$("." + cls).parent().attr('title', '');
	}
}

// 校验固定格式
function isCheckValSty(value, cls, title, regexp) {
	if($.trim(value).length > 0) {
		if(!regexp.test(value)) {
			isCheckValNull('', cls, title);
		} else {
			isCheckValNull(value, cls, title);
		}
	}
}

/**------ 判断对象是否为空：不为空-ture、为空-false ------*/
function isZuiUndefined(variable) {
	return typeof variable == 'undefined' || 
		$.trim(variable) == '' || $.trim(variable) == 'NULL' ? false : true;
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

/**------ 随机生成指定位数的字符串 ------*/
function randomString(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

/**------ JS事件阻止冒泡 ------*/
function stopevt() {
	var ev = getEvent();
    if (ev.stopPropagation) {
        ev.stopPropagation();
    } else if (window.ev) {
        window.ev.cancelBubble = true;
    }
}

/**------ 获取各浏览器事件对象 ------*/
function getEvent() {
    if (document.all) {
        return window.event; //如果是ie
    }
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}

