if(typeof zuiMain.dataList == 'undefined'){
	zuiMain.dataList = {};
}
zuiMain.limit = 20;
zuiMain.start = 0;
/**
 * 表格请求函数
 * @param {} tabcls
 * @param {} totalCount
 * @param {} dataList
 */
function loadTableDataList(tabcls, reqUrl, pagecls, formcls, limit, start) {
	if(isUndefined(reqUrl)) {
		var params = '';
		if(!isUndefined(limit)) {
			limit = zuiMain.limit; // 默认每页显示数量
		}
		params += 'limit='+limit;
		if(!isUndefined(start)) {
			start = zuiMain.start; // 默认第一页
		}
		params += '&start='+start;
		var loadReqUrl = '';
		if(reqUrl.indexOf('http') < 0) {
			loadReqUrl = zuiMain.contentPath;
		}
		if(isUndefined(formcls) && $("."+formcls).length > 0) {
			params += '&' + $("."+formcls).serialize();
		}
		if(isUndefined(pagecls)) {
			if(!zuiMain.dataList[pagecls]) {
				zuiMain.dataList[pagecls] = {};
			}
			zuiMain.dataList[pagecls]['tabcls'] = tabcls;
			zuiMain.dataList[pagecls]['reqUrl'] = reqUrl;
			zuiMain.dataList[pagecls]['formcls'] = formcls;
		}
		loadReqUrl += reqUrl;
		$.ajax({
			type: 'POST',
			url: loadReqUrl,
			processData: true,
			data: params,
			success: function(callData) {
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
function eachAjaxData(tabcls, pagecls, jsonData) {
	
	var dataList = jsonData.responseEntity;
	
	zuiMain.dataList[tabcls] = {};
	// 表头对象
	var dataHeader = $("." + tabcls + " thead tr");
	// 表体对象
	var dataTabBody = $("." + tabcls + " tbody");
	// 表格父对象高度值
	var tabPantHeight = 0;
	// 数据集合大小
	var dataLength = dataList.length;
	
	var headAry = new Array();
	var showColumn = 0;
	dataHeader.children().each(function(){
		var name = $(this).attr('name');
		var hidden = $(this).attr('hidden');
		var functName = $(this).attr('functName');
		var params = {
			name: isUndefined(name) ? name : '',
			hidden: isUndefined(hidden) ? hidden : '',
			functName: isUndefined(functName) ? functName : ''
		};
		if(!isUndefined(hidden)) {
			showColumn++;
		}
		headAry.push(params);
	});
	$("." + tabcls + " tbody tr").remove();
	if(dataLength > 0 && headAry.length > 0) {
		for(var i=0; i<dataLength; i++) {
			var data = dataList[i];
			var dataId = tabcls+"-"+i; // new Date().format("yyyyMMddhhmmss");
			zuiMain.dataList[tabcls][dataId] = data;
			var dataTr = $('<tr id="'+dataId+'" number="'+i+'" onclick="selectRawData(\''+dataId+'\')"></tr>');
	        dataTr.appendTo(dataTabBody);
			$.each(headAry, function(n, params) {
				var isHas = 0;
				var hiden = '';
				if(isUndefined(params.hidden)) {
					hiden = 'hidden="true"';
				}
				if(params.name == 'checkbox') {
					var dataTd= $(
					'<td ' + hiden + '>' +
						'<input id="chb-' + dataId + '" onclick="selectRawData(\''+dataId+'\')" number="'+i+'" type="checkbox" class="isCkbx" />' +
					'</td>'
					);
					dataTd.appendTo(dataTr);
				}
				else {
					$.each(data, function(key, text) {
						if(key == params.name) {
							if(isUndefined(params.functName)) {
								text = eval(params.functName+"('"+text+"', data)");
							}
							if(!isUndefined(text)) {
								text = '';
							}
							var dataTd= $('<td ' + hiden + '><div>' + text + '</div></td>');
							dataTd.appendTo(dataTr);
							isHas = 1;
							return false;
						}
					});
					if(isHas == 0) {
						var dataTd= $('<td ' + hiden + '><div>&nbsp;</div></td>');
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
	
	tabPantHeight += $("." + tabcls + " tr").height() + (dataLength * $("." + tabcls + " tbody tr").height()) + 8;
	if(tabPantHeight > 0) {
		$("." + tabcls).parent().css({
			'height': tabPantHeight + 'px'
		});
	}
	
	handlerPageInfo(pagecls, jsonData);
	
	autoDataListPanelSize();
}
/**
 * 获取选中的行对象数据
 * @param {} tabcls
 * @param {} trId
 * @return {}
 */
function getTableRawData(tabcls, trId) {
	var res = null;
	$.each(zuiMain.dataList[tabcls], function(key, data) {
		if(key == trId) {
			res = data;
		}
	});
	return res;
}
/**
 * 获取表格选择的数据列表
 * @param {} tabcls
 */
function getTableSelectDataList(tabcls) {
	var dataList = new Array();
	$("." + tabcls + ' tbody tr :checkbox.isCkbx').each(function(){
		if($(this).prop("checked")) {
			var dataId = $(this).parent().parent().attr("id");
			var data = getTableRawData(tabcls, dataId);
			if(null != data) {
				dataList.push(data);
			}
		}
	});
	return dataList;
}
/**
 * 处理page分页信息
 * @param {} tabcls
 */
function handlerPageInfo(pagecls, jsonData) {
	// 总数
	var totalCount = jsonData.count;
	// 当前页码
	var start = jsonData.start;
	if(!isUndefined(start) || start <= 0) {
		start = zuiMain.start; // 默认第一页
	}
	zuiMain.dataList[pagecls]['start'] = start;
	// 每页显示数量
	var limit = jsonData.limit;
	if(!isUndefined(limit) || limit <= 0) {
		limit = zuiMain.limit; // 默认每页显示数量
	}
	zuiMain.dataList[pagecls]['limit'] = limit;
	// 当前页显示数量
	var currCount = jsonData.responseEntity.length;
	var totalPage = 0;
	if(totalCount%currCount != 0) {
		totalPage++;
	}
	totalPage += parseInt(totalCount/currCount);
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
	
	$("."+pagecls+" .startcls").click(function(){
		if(zuiMain.dataList[pagecls]['currPage'] != 1) {
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], 0);
		}
	});
	$("."+pagecls+" .firstcls").click(function(){
		if(zuiMain.dataList[pagecls]['start'] > 0) {
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], zuiMain.dataList[pagecls]['start'] - 1);
		}
	});
	$("."+pagecls+" .nextcls").click(function(){
		if(zuiMain.dataList[pagecls]['start'] < totalPage-1) {
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], zuiMain.dataList[pagecls]['start'] + 1);
		}
	});
	$("."+pagecls+" .endcls").click(function(){
		if(zuiMain.dataList[pagecls]['currPage'] != totalPage) {
			loadTableDataList(tabcls, reqUrl, pagecls, formcls, 
				zuiMain.dataList[pagecls]['limit'], totalPage-1);
		}
	});
}
/**
 * 全选响应事件
 * @param {} tabcls
 */
function isSelectAll(tabcls, obj) {
	$("." + tabcls + ' tbody tr :checkbox.isCkbx').each(function(){
		if($(obj).prop("checked")) {
			$(this).prop("checked", true); 
		}
		else {
			$(this).prop("checked", false); 
		}
	});
}
/**
 * 点击选择某行
 * @param {} dataId
 */
function selectRawData(dataId) {
	var chbObj = $("#chb-" + dataId);
	if(!chbObj.prop("checked")) {
		chbObj.prop("checked", true); 
	}
	else {
		chbObj.prop("checked", false); 
	}
}
/**
 * 重置表单
 * 并且刷新（前提所有参数必须齐全）
 */
function refreshTableDataList(formcls, tabcls, reqUrl, pagecls) {
	if(isUndefined(formcls) && $("."+formcls).length > 0) {
		// 重置表单
		$("."+formcls)[0].reset();
		// 并且刷新Table
		if(isUndefined(tabcls) && isUndefined(reqUrl) && isUndefined(pagecls)) {
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
