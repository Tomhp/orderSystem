/*===========================================================
 * 说明：弹出浮动窗口-Etw框架
 * 版本：SX-ETW-V1.0.0
 * 作者：ZOUYONG
 * 日期：2014/07/16 
 * 许可信息：licenses（free-免费开源）
 ===========================================================*/
(function(window, undefined) {

	/* Etw框架主对象
	=========================================================== */
	var Etw = {
		title: null,				// 窗口标题
		type: null,					// 窗口类型（tip-专门的提示窗口不能请求url，nav-可以请求url，如果需要远程请求则需求设置成nav）
		width: null,				// 窗口宽度
		height: null,				// 窗口高度
		isHaveMask: true,			// 是否需要遮罩，默认为true-有遮罩
		content: null,				// 内容区域
		reqUrl: null,				// Ajax请求的链接地址
		reqType: null,				// Ajax请求类型：post、get
		reqData: null,				// Ajax请求的参数对象（例如：var parma = {}）
		closeBtn: null,				// 窗口关闭按钮
		quedingBtn: null,			// 窗口确定按钮
		quedingFn: null,			// 窗口确定按钮回调函数
		quxiaoBtn: null,			// 窗口取消按钮
		isFnSame: false,			// 关闭和取消按钮是否要同步确定按钮事件（默认不同步）
		winAlign: null,				// 窗口显示位置：center、left(暂未支持)、right(暂未支持)
		skin: null,					// 窗口默认皮肤
		icon: null					// 窗口提示标签：普通提示-INFO、错误提示-ERROR、惊喜提示-LOVE、删除提示-DELETE、没有图标-NONE
	}
	
	Etw.showWindowAry = [];

	/* Etw框架-主控制器
	=========================================================== */
	Etw.Controller = {
		
		/* Etw框架-主对象初始化函数
		 --------------------------------*/
		init: function(attrbtObj) {

			Etw.title = attrbtObj.title;
			if(!Etw.Check.validator(attrbtObj.type)) {
				Etw.type = Etw.wnty.prompt_tip;
			} else {
				Etw.type = attrbtObj.type;
			}
			Etw.width = attrbtObj.width;
			Etw.height = attrbtObj.height;
			Etw.content = attrbtObj.content;
			if(Etw.Check.validator(attrbtObj.isHaveMask)) {
				Etw.isHaveMask = attrbtObj.isHaveMask;
			} else {
				Etw.isHaveMask = true;
			}
			Etw.reqUrl = attrbtObj.reqUrl;
			Etw.reqType = attrbtObj.reqType;
			Etw.reqData = attrbtObj.reqData;
			Etw.closeBtn = attrbtObj.closeBtn;
			Etw.quedingBtn = attrbtObj.quedingBtn;
			Etw.quxiaoBtn = attrbtObj.quxiaoBtn;
			Etw.quedingFn = attrbtObj.quedingFn;
			Etw.icon = attrbtObj.icon;
			
			// 关闭和取消按钮是否要同步确定按钮事件
			if(Etw.Check.validator(attrbtObj.isFnSame)) {
				Etw.isFnSame = attrbtObj.isFnSame;
			} else {
				Etw.isFnSame = false; // 默认不同步
			}
			
			// 窗口显示位置：center、left(暂未支持)、right(暂未支持)
			if(Etw.Check.validator(attrbtObj.winAlign)) {
				Etw.winAlign = attrbtObj.winAlign;
			}
			
			// 弹窗皮肤 
			if(Etw.Check.validator(attrbtObj.skin)) {
				Etw.skin = attrbtObj.skin;
			} else {
				Etw.skin = Etw.winSkin.defaultSkin;
			}
			
			// 保存弹出层窗口对象属性
			Etw.Controller.createEtwObject();
			
			// 构建弹出层窗口
			Etw.Controller.constructor();
			
		},
		/* 保存弹出层窗口对象属性
		 --------------------------------*/
		createEtwObject: function() {
			
			for(var i=0; i<Etw.showWindowAry.length; i++) {
				var obj = Etw.showWindowAry[i];
				if(obj.type == Etw.type) {
					var size = i;
					if(size == 0) {
						size = i+1;
					}
					Etw.showWindowAry.splice(i, size);
				}
			}
			Etw.options = {
				title: Etw.title,
				type: Etw.type,
				width: Etw.width,
				height: Etw.height,
				isHaveMask: Etw.isHaveMask,
				content: Etw.content,
				reqUrl: Etw.reqUrl,
				reqType: Etw.reqType,
				reqData: Etw.reqData,
				closeBtn: Etw.closeBtn,
				quedingBtn: Etw.quedingBtn,
				quedingFn: Etw.quedingFn,
				quxiaoBtn: Etw.quxiaoBtn,
				skin: Etw.skin,
				icon: Etw.icon
			}
			Etw.showWindowAry.push(Etw.options);
		},
		/* Etw框架-主对象属性还原初始化
		 --------------------------------*/
		reset: function(attrbtObj) {
			
			Etw.Controller.init(attrbtObj);
			
			Etw.Controller.createEtwObject();
		},
		/* 构造器方法
		 --------------------------------*/
		constructor: function() {
			
			// 是否要发送Ajax请求
			if(Etw.Check.validator(Etw.reqUrl)) {
				
				// 请求类型
				if(!Etw.Check.validator(Etw.reqType)) {
					Etw.reqType = 'POST';
				}
				// 请求参数对象
				if(!Etw.Check.validator(Etw.reqData)) {
					Etw.reqData = {};
				}
				if("get" == Etw.reqType || "GET" == Etw.reqType) {
					$.ajax({
						type: Etw.reqType,
						url: Etw.reqUrl,
						processData: true,
						data: Etw.reqData,
						success: function(callData) {
							Etw.content = callData;
							Etw.Controller.buildWinDetail(Etw.wnty.prompt_req);
						},
						error: function() {
							Etw.Controller.closeEtwAmong(Etw.type);
							Etw.Msg.alert("提示", "请求"+Etw.reqUrl+"响应超时！");
						}
					});
				} else if("post" == Etw.reqType || "POST" == Etw.reqType) {
					$.ajax({
						type: Etw.reqType,
						url: Etw.reqUrl,
						processData: true,
						data: Etw.reqData,
						success: function(callData) {
							Etw.content = callData;
							Etw.Controller.buildWinDetail(Etw.wnty.prompt_req);
						},
						error: function() {
							Etw.Controller.closeEtwAmong(Etw.type);
							Etw.Msg.alert("提示", "请求"+Etw.reqUrl+"响应超时！");
						}
					});
				}
			}
			// 普通提示窗口
			else if(Etw.Check.validator(Etw.content)) {
				Etw.Controller.buildWinDetail(Etw.wnty.prompt_pt);
			}
			
		},
		/* 构建窗口详细内容
		 --------------------------------*/
		buildWinDetail: function(winType) {
			
			// 判断构建的窗口是否已经存在
			if($("#sxbbsUdfFloatDragWindow_"+Etw.type).length > 0) {
				$("#sxbbsUdfFloatDragWindow_"+Etw.type).hide();
				$("#sxbbsUdfFloatDragWindow_"+Etw.type).remove();
			}
			if(null != Etw.events.appWinTimer) {
				window.clearInterval(Etw.events.appWinTimer);
				Etw.events.appWinTimer = null;
			}
			
			// 创建总DIV
			var allIndex = 1999;
			var zheZhaoIndex = 1900;
			if('nav' == Etw.type) {
				allIndex = 1888;
				zheZhaoIndex = 1600;
			}
			var etwAllCls = 'flb_window';
			if(Etw.type == Etw.wnty.prompt_apptip) {
				etwAllCls = '';
			}
			var EtmAllDiv = $('<div class="moveAll_'+Etw.type+' ' + etwAllCls + ' etwAllSameCls" id="sxbbsUdfFloatDragWindow_'+
					Etw.type+'" style="position: absolute; z-index: '+allIndex+'; top: 0px;"></div>')
			var EtwAllDivHtml = '';
			if(Etw.skin == Etw.winSkin.graySkin) {
				EtwAllDivHtml += 
					'<div class="modal-dialog"><div class="modal-content">';
			} else {
				EtwAllDivHtml += 
					'<table cellpadding="0" cellspacing="0" class="" style="width: 100%;">' + 
						'<tr>' + 
							'<td class="t_l"></td><td class="t_c"></td><td class="t_r"></td>' + 
						'</tr>' + 
						'<tr>' + 
							'<td class="m_l">&nbsp;</td>' + 
							'<td class="m_c" style="background: white;">'
			}
			// 遮罩层处理
			if(Etw.type == Etw.wnty.prompt_mask) {
				EtwAllDivHtml += '<div class="etw_zezao_main">\
						<div class="zezao_main_Progress">\
							<div class="zezao_main_ProgressBar">\
								<div class="zezao_main_message">'+Etw.content+'</div>\
							</div>\
						</div>\
					</div>';
			} else {
				//--------------- 标题部分 ---------------
				if(Etw.type != Etw.wnty.prompt_apptip) {
					if(Etw.skin == Etw.winSkin.graySkin) {
						EtwAllDivHtml += 
						'<div class="modal-header" id="'+Etw.type+'_bar">' + 
							'<a class="close sxbbs_udf_drag_close_' + 
								Etw.type+'" id="closeIcon_'+ Etw.type + '">×</a>' + 
							'<div class="modal-title">'+Etw.title+'</div>' + 
						'</div>' ;
					} else {
						EtwAllDivHtml += 
						'<div style="height: 40px; width: 100%;">' +
							'<h3 class="flb" id="'+Etw.type+'_bar">' + 
								'<span class="flb_text" id="sxbbs_udf_drag_title_'+Etw.type+'">'+Etw.title+'</span>' + 
								'<span>' + 
									'<div onclick="javascript:void(0);" id="closeIcon_'+ Etw.type; 
						if(Etw.Check.validator(Etw.quedingFn)) {
							EtwAllDivHtml += '" class="flbc etw_queding_callbackfun"></div>';
						} else {
							EtwAllDivHtml += '" class="flbc sxbbs_udf_drag_close_'+Etw.type+'"></div>';
						}
						EtwAllDivHtml += 
								'</span>' + 
							'</h3>' + 
						'</div>';
					}
				}
				//--------------- 内容部分 ---------------
				if(Etw.skin == Etw.winSkin.graySkin) {
					EtwAllDivHtml += '<div class="modal-body" style="';
				}
				else if(Etw.type == Etw.wnty.prompt_apptip) {
					EtwAllDivHtml += '<div class="modal-body-apptip" style="';
				}
				else {
					EtwAllDivHtml += '<div style="';
				}
				var widthStatus = Etw.Check.validator(Etw.width);
				if(winType == Etw.wnty.prompt_pt && !widthStatus) {
					if(Etw.type != Etw.wnty.prompt_apptip) {
						EtwAllDivHtml += 'width: '+Etw.size.defaultWidth+'px;';
					}
				}
				else {
					if(widthStatus) {
						EtwAllDivHtml += "width: "+Etw.width+"px;";
					} else {
						EtwAllDivHtml += "width: 100%;";
					}
				}
				if(Etw.Check.validator(Etw.height)) {
					EtwAllDivHtml += "height: "+Etw.height+"px;";
				}
				EtwAllDivHtml += '">'; 
				
				if(Etw.wnty.prompt_tip == Etw.type) {
					var EtwIcon = 'flb_div_'+Etw.MsgBox.DEFAULT;
					if(Etw.Check.validator(Etw.icon)) {
						if('NONE' == Etw.icon) {
							EtwIcon = '';
						} else {
							EtwIcon = 'flb_div_'+Etw.icon;
						}
					}
					EtwAllDivHtml += '<table width="100%"><tr>'; 
							if($.trim(EtwIcon) != '') {
								EtwAllDivHtml += 
									'<td width="50" valign="top">' + 
										'<div class="'+EtwIcon+'">&nbsp;</div>' + 
									'</td>';
							} else {
								EtwAllDivHtml += '<td>&nbsp;</td>';
							}
					EtwAllDivHtml += 
								'<td valign="middle">' + 
									'<div class="flb_content">'+Etw.content+'</div>' + 
								'</td>' + 
							'</tr>' + 
						'</table>' ;
				} else {
					EtwAllDivHtml += '<div class="content_body_'+Etw.type+'">' + Etw.content + '</div>';
				}
				
				if(Etw.skin == Etw.winSkin.graySkin) {
					EtwAllDivHtml += 
						'</div>' + 
						'<div class="modal-footer">' + 
							'<a id="queding_'+ Etw.type+'" class="btn btn-primary ';
					if(Etw.Check.validator(Etw.quedingFn)) {
						EtwAllDivHtml += ' etw_queding_callbackfun';
					} else {
						EtwAllDivHtml += ' sxbbs_udf_drag_close_'+Etw.type;
					}
					EtwAllDivHtml += '">确定</a>';
					if(Etw.Check.validator(Etw.quxiaoBtn)) {
						EtwAllDivHtml += 
							'<button class="btn btn-default sxbbs_udf_drag_close_' + 
								Etw.type+'" id="quXiao_'+ Etw.type+'">取消</button>';
					}
					else if(Etw.Check.validator(Etw.quedingFn)) {
						EtwAllDivHtml += 
							'<button class="btn btn-default sxbbs_udf_drag_close_' + 
								Etw.type+'" id="quXiao_'+ Etw.type+'">取消</button>';
					}
					EtwAllDivHtml += '</div></div></div>';
				} else {
					if(Etw.type != Etw.wnty.prompt_apptip) {
						EtwAllDivHtml += 
							'<div class="o"><button id="queding_'+ Etw.type+'" class="pn pn_ok ';
						if(Etw.Check.validator(Etw.quedingFn)) {
							EtwAllDivHtml += ' etw_queding_callbackfun';
						} else {
							EtwAllDivHtml += ' sxbbs_udf_drag_close_'+Etw.type;
						}
						EtwAllDivHtml += '"><strong>确定</strong></button>';
						if(Etw.Check.validator(Etw.quxiaoBtn)) {
							EtwAllDivHtml += '&nbsp;<button id="queding_'+ Etw.type+'"' +  
								'class="pn pn_ok sxbbs_udf_drag_close_'+Etw.type+'"><strong>取消</strong></button>';
						}
						EtwAllDivHtml += '</div>';
					}
					EtwAllDivHtml += '</td>' + 
							'<td class="m_r">&nbsp;</td>' + 
						'</tr>' + 
						'<tr>' + 
							'<td class="b_l"></td><td class="b_c"></td><td class="b_r"></td>' + 
						'</tr>' + 
					'</table>';
				}
			}
			EtmAllDiv.html(EtwAllDivHtml);
			
			// 是否添加遮罩
			if(Etw.isHaveMask) {
				if($("#sxbbs_udf_zhezhao_"+Etw.type).length <= 0) {
					var EtmAllZheZhao = $('<div style="display: none; z-index: '+zheZhaoIndex+';" ' + 
							'class="sxbbs_udf_zhezhao" id="sxbbs_udf_zhezhao_'+Etw.type+'">&nbsp;</div>');
					EtmAllZheZhao.appendTo('body');
				}
				$("#sxbbs_udf_zhezhao_"+Etw.type).css("height", document.body.scrollHeight + "px");
				$("#sxbbs_udf_zhezhao_"+Etw.type).css("width", document.body.scrollWidth + "px");
				$("#sxbbs_udf_zhezhao_"+Etw.type).show();
			}
			
			// 浮动窗口显示
			EtmAllDiv.appendTo('body');
			$("#sxbbsUdfFloatDragWindow_"+Etw.type).show();
			
			if(Etw.type == Etw.wnty.prompt_mask) {
				// 处理遮罩层
				Etw.Controller.setEtwMaskEvent();
			} else {
				// 设置浮动窗口拖动位置
				Etw.Controller.setEtwDragEvent();
			}
			
			// 设置窗口相关事件
			Etw.Controller.bindEtwAllEvent();

			// 设置浮动窗口位置
			Etw.Controller.setEtwPosition();
			//window.setTimeout(Etw.Controller.setEtwPosition, 0);
			
			// APP提示窗口-2秒钟关闭窗口
			if(Etw.type == Etw.wnty.prompt_apptip) {
				Etw.events.appWinTimer = window.setInterval(Etw.Controller.closeAppTipWin, 2000);
			}
			else {
				var blowerHeight = Etw.heights.blowerMinHeight();
				var allHeight = $('.moveAll_'+Etw.type).height();
				if(allHeight > blowerHeight) {
					$('.content_body_'+Etw.type).css({
						'height': (blowerHeight - 90) + 'px'
					});
					$('.content_body_'+Etw.type).addClass('overflow-y');
				}
				Etw.Controller.setEtwPosition();
			}
		},
		/* 关闭APP窗口
		 --------------------------------*/
		closeAppTipWin: function() {
			if(null != Etw.events.appWinTimer) {
				window.clearInterval(Etw.events.appWinTimer);
				Etw.events.appWinTimer = null;
			}
			Etw.Controller.closeEtwAmong(Etw.type);
		},
		/* 设置所有浮动窗口的位置
		 --------------------------------*/
		setEtwPosition: function() {
			// JS遍历Etw框架窗口类型
			for(var s in Etw.wnty) {
				Etw.Controller.setEtwPositionVal(Etw.wnty[s]);
			}
		},
		/* 设置窗口位置-默认为居中
		 --------------------------------*/
		setEtwPositionVal: function(type) {
			var EtmDragWin = $("#sxbbsUdfFloatDragWindow_"+type);
			if(EtmDragWin.length > 0 && EtmDragWin.is(":visible")) {
				var wnd = $(window), doc = $(document);
				var left = doc.scrollLeft();
				var top = doc.scrollTop();
				left += (wnd.width() - EtmDragWin.width())/2;
				top += (wnd.height() - EtmDragWin.height())/2;
				if(top < 0) {
					top = 0;
				}
				if(type == Etw.wnty.prompt_apptip && Etw.winAlign != 'center') {
					EtmDragWin.css({
						"top": wnd.height() - 80 + 'px',
						"left": left
					});
				} else {
					EtmDragWin.css({
						"top": top,
						"left": left
					});
				}
				$("#sxbbs_udf_zhezhao_"+type).css({
					"height": document.body.scrollHeight + "px",
					"width": wnd.width() + "px"
				});
			}
		},
		/* 设置浮动窗口拖动位置
		 --------------------------------*/
		setEtwDragEvent: function() {
			$("#"+Etw.type+"_bar").mousedown(
				function (event) {
	            var isMove = true;
	            var abs_x = event.pageX - $(".moveAll_"+Etw.type).offset().left;
	            var abs_y = event.pageY - $(".moveAll_"+Etw.type).offset().top;
	            $(document).mousemove(function (event) {
					if (isMove) {
						var obj = $(".moveAll_"+Etw.type);
						var owh = obj.width();
						var ohg = obj.height();
						var hg = $(window).height();
						var wh = $(window).width();
						var lt = event.pageX - abs_x;
						var tp = event.pageY - abs_y;
                        obj.css({'left': lt, 'top': tp});
					}
				}).mouseup(
					function () {
						isMove = false;
					}
	            );
			});
		},
		/* 绑定窗口相关事件
		 --------------------------------*/
		bindEtwAllEvent: function() {
			$(".sxbbs_udf_drag_close_"+Etw.type).bind("click", function() {
				Etw.Controller.setEtwCloseEvent($(this));
			});
			$(".etw_queding_callbackfun").bind("click", function() {
				var clsBtnId = $(this).attr("id");
				var idStr = clsBtnId.split("_");
				if(idStr.length >= 2) {
					var attriteEtw = Etw.Controller.getEtwAttriteWin(idStr[1]);
					if(null != attriteEtw) {
						attriteEtw.quedingFn();
					}
				}
			});
		},
		/* 设置关闭事件
		 --------------------------------*/
		setEtwCloseEvent: function(closeObj) {
			var clsBtnId = closeObj.attr("id");
			var idStr = clsBtnId.split("_");
			if(idStr.length >= 2) {
				var attriteEtw = Etw.Controller.getEtwAttriteWin(idStr[1]);
				if(null != attriteEtw) {
					$('#sxbbsUdfFloatDragWindow_'+attriteEtw.type).hide();
					$('#sxbbsUdfFloatDragWindow_'+attriteEtw.type).remove();
					$('#sxbbs_udf_zhezhao_'+attriteEtw.type).hide();
					// 更新Etw窗口属性
					Etw.Controller.updateShowWindowAry(attriteEtw.type);
					if(Etw.Check.validator(Etw.quedingFn)) {
						if(Etw.isFnSame) {
							attriteEtw.quedingFn();
						} else {
							// 关闭弹出窗口
							Etw.Controller.closeEtwAmong(Etw.type);
						}
					}
				}
			}
		},
		/* 删除指定类型的窗口
		 --------------------------------*/
		closeEtwAmong: function(type) {
			$('#sxbbsUdfFloatDragWindow_'+type).hide();
			$('#sxbbsUdfFloatDragWindow_'+type).remove();
			$('#sxbbs_udf_zhezhao_'+type).hide();
			// 更新Etw窗口属性
			Etw.Controller.updateShowWindowAry(type);
		},
		/* 获取指定类型的Etw属性对象
		 --------------------------------*/
		getEtwAttriteWin: function(type) {
			for(var i=0; i<Etw.showWindowAry.length; i++) {
				var obj = Etw.showWindowAry[i];
				if(obj.type == type) {
					return obj;
				}
			}
			return null;
		},
		/* 更新Etw窗口属性
		 --------------------------------*/
		updateShowWindowAry: function(type) {
			var updateShowObj = null;
			for(var i=0; i<Etw.showWindowAry.length; i++) {
				var obj = Etw.showWindowAry[i];
				if(obj.type != type) {
					updateShowObj = obj;
				}
				if(obj.type == type) {
					var size = i;
					if(size == 0) {
						size = i+1;
					}
					Etw.showWindowAry.splice(i, size);
				}
			}
			if(null != updateShowObj) {
				// Etw.Controller.reset(updateShowObj);
				Etw.type = updateShowObj.type;
			}
		},
		/* 设置遮罩层进度条加载事件
		 --------------------------------*/
		setEtwMaskEvent: function() {
			var totalWidth = $(".zezao_main_Progress").css("width");
			totalWidth = totalWidth.substring(0, totalWidth.indexOf("px"));

			var zezaoWidth = $(".zezao_main_ProgressBar").css("width");
			zezaoWidth = zezaoWidth.substring(0, zezaoWidth.indexOf("px"));
			
			var endWidth = parseFloat(zezaoWidth) + parseFloat(totalWidth/20);
			if(parseFloat(endWidth) >= parseFloat(totalWidth)) {
				endWidth = 0;
			}
			
			$(".zezao_main_ProgressBar").css("width", endWidth + "px");
			if(null == Etw.events.maskEventName) {
				Etw.events.maskEventName = window.setInterval("Etw.Controller.setEtwMaskEvent()", 800);
			}
		},
		/* 关闭遮罩层进度条加载事件
		 --------------------------------*/
		closeEtwMaskEvent: function(eventName) {
			// 先暂停定时器
			window.clearInterval(eventName);
			// 关闭弹出窗口
			Etw.Controller.closeEtwAmong(Etw.wnty.prompt_mask);
		}
	}

	/* Etw框架-消息提示主对象
	=========================================================== */
	Etw.Msg = {
		
		/* 普通消息提示框
		 --------------------------------*/
		alert: function(title, content, callBackFnt) {
			
			Etw.Controller.init({
				title: title,
				content: content,
				quedingFn: callBackFnt
			});
		},
		/* 指定皮肤-普通消息提示框
		 --------------------------------*/
		eject: function(title, skin, content, callBackFnt) {
			
			Etw.Controller.init({
				title: title,
				skin: skin,
				content: content,
				quedingFn: callBackFnt
			});
		},
		/* 选择消息提示框
		 --------------------------------*/
		confirm: function(title, content, callBackFnt) {
			
			Etw.Controller.init({
				title: title,
				content: content,
				isFnSame: false,
				quedingFn: callBackFnt,
				quxiaoBtn: 'quxiaoBtn'
			});
		},
		/* 多选项设置消息提示框
		 --------------------------------*/
		show: function(optsCfgObj) {
			
			Etw.Controller.init(optsCfgObj);
		},
		/* 遮罩提示窗口
		 --------------------------------*/
		mask: function(message) {
			
			if(!Etw.Check.validator(message)) {
				message = "加载中，请稍后...";
			}
			Etw.Controller.init({
				content: message,
				type: Etw.wnty.prompt_mask
			});
		},
		/* 关闭遮罩提示窗口
		 --------------------------------*/
		unMask: function() {
			
			Etw.Controller.closeEtwMaskEvent(Etw.events.maskEventName);
			Etw.events.maskEventName = null;
		},
		/* APP端提示窗口类
		 --------------------------------*/
		appWin: function(content, winAlign, isHaveMask) {
			Etw.Controller.init({
				isHaveMask: false,
				content: content,
				type: Etw.wnty.prompt_apptip,
				winAlign: winAlign,
				isHaveMask: isHaveMask
			});
		}
	}
	
	/* Etw框架-对各种高度的处理
	=========================================================== */
	Etw.heights = {
		
		// 浏览器可见区域高度
		blowerMinHeight: function() {
			var minHeight = 0;
		    if (window.innerHeight)
		        minHeight = window.innerHeight;
		    else if ((document.body) && (document.body.clientHeight))
		        minHeight = document.body.clientHeight;
		    if (document.documentElement && document.documentElement.clientHeight) {
		        minHeight = document.documentElement.clientHeight;
		    }
		    return minHeight;
		},
		
		// 浏览器可见区域宽度
		blowerMinWidth: function() {
			var minWidth = 0;
		    if (window.innerWidth)
		        minWidth = window.innerWidth;
		    else if ((document.body) && (document.body.clientWidth))
		        minWidth = document.body.clientWidth;
		    if (document.documentElement && document.documentElement.clientWidth) {
		        minWidth = document.documentElement.clientWidth;
		    }
		    return minWidth;
		}
	}

	/* Etw框架-消息提示图片对象
	=========================================================== */
	Etw.MsgBox = {
		
		/* 普通提示-INFO、错误提示-ERROR、惊喜提示-LOVE
		 --------------------------------*/
		INFO: 'INFO',
		ERROR: 'ERROR',
		LOVE: 'LOVE',
		DEFAULT: 'INFO'
	}

	/* Etw框架-Button系列
	=========================================================== */
	Etw.Button = {
		
		/* YES-确定  NO-不确定 YES-不取消 CANCEL-取消
		 --------------------------------*/
		OK: '',
		NO: '',
		YES: '',
		CANCEL: ''
	}

	/* Etw框架-窗口类型
	=========================================================== */
	Etw.wnty = {
		
		/* 提示窗口-tip 
		 * 远程请求数据窗口-nav
		 * 遮罩窗口-mask
		 * APP提示窗口-apptip
		 *--------------------------------*/
		prompt_tip: 'tip',
		prompt_nav: 'nav',
		prompt_mask: 'mask',
		prompt_pt: 'putong',
		prompt_req: 'request',
		prompt_apptip: 'apptip'
	}

	/* Etw框架-校验器
	=========================================================== */
	Etw.Check = {

		/* 非空验证
		---------------------------------*/
		validator: function(variable) {
			return typeof variable == 'undefined' || variable == null || 
				$.trim(variable) == '' || $.trim(variable) == 'NULL' ? false : true;
		}
	}

	/* Etw框架-事件器
	=========================================================== */
	Etw.events = {

		/* 遮罩层事件定时器
		--------------------------------*/
		maskEventName: null,
		
		/* app模式下窗口定时关闭
		--------------------------------*/
		appWinTimer: null
	}

	/* Etw框架-窗口尺寸集合
	=========================================================== */
	Etw.size = {
		
		/* 窗口默认的宽度和高度 
		 *--------------------------------*/
		defaultWidth: 350,
		defaultHeight: 350
	}
	
	/* Etw框架-皮肤风格
	 * skin：blue、gray
	=========================================================== */
	Etw.winSkin = {
		defaultSkin: 'blue',
		blueSkin: 'blue',
		graySkin: 'gray'
	}

	window.Etw = Etw;
	
	$(window).resize(function() {
		Etw.Controller.setEtwPosition();
	});
	
})(window);

