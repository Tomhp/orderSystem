package com.ordersystem.index;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.didong.manager.frame.spring.controller.AbstractBaseController;

/**
 * 系统名称：递咚-中国互联网快递
 * 模块名称：
 * 模块描述：首页请求处理类
 * 功能列表：
 * 模块作者：ZOUYONG
 * 开发时间：2016年10月20日 上午10:44:10
 * 模块路径：com.wolaiban.server.service.index.IndexController
 * 更新记录：
 */
@Controller
public class IndexController extends AbstractBaseController {

	// 日志操作对象
	private final Logger logger = Logger.getLogger(IndexController.class);

	/**
	 * 功能描述：系统启动后默认请求
	 * 模块作者：ZOUYONG
	 * 开发时间：2016年8月5日 下午3:43:46
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/")
	public String index(HttpServletRequest request) {
		
		logger.info("request index pages.");
		
		return "/index/index.html";
	}

}
