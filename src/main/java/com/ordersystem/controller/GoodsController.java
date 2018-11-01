package com.ordersystem.controller;

import java.util.Date;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.didong.manager.frame.api.entity.ResponseParameterEntity;
import com.didong.manager.frame.spring.controller.AbstractBaseController;
import com.ordersystem.po.Goods;
import com.ordersystem.po.Order;
import com.ordersystem.service.IGoodsService;
import com.ordersystem.service.IOrderService;

/**
 * 系统名称：餐厅点餐系统
 * 模块名称：GoodsController
 * 功能描述：商品模块控制层
 * 模块作者：LIHEPING
 * 开发时间：2017年2月5日下午9:38:29
 * 模块路径:com.didongIndex.controller
 * 更新记录：
 */
@Controller
@RequestMapping("/goods")
public class GoodsController extends AbstractBaseController {
	// 日志操作对象
	private final Logger logger=Logger.getLogger(GoodsController.class);
	// 注入service
	@Resource
	private IGoodsService iGoodService;
	@Resource
	private IOrderService iOrderService;
	/**
	 * 功能描述：跳转至商品信息首页
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月5日下午9:45:31
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/goodsIndex")
	public String goodsIndex(HttpServletRequest request,HttpServletResponse response) throws Exception{
		return "/module/goods/goodsIndex.html";
	}
	/**
	 * 功能描述：查询商品或是展示所有商品信息
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月5日下午9:50:58
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/goodsList")
	public String goodsList(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("goods") Goods goods,@ModelAttribute("resp") ResponseParameterEntity resp) 
					throws Exception{ 
		List<Goods> goodsList=iGoodService.getAllGoods(goods);
		resp.setResultFlag(true);
		resp.setResponseEntity(goodsList);
		resp.setCount(5l);
		success(response, resp);
		return null;
	}
	/**
	 * 功能描述：跳转至新增或是修改商品信息页面
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月5日下午10:04:51
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/addOrUpdateIndex")
	public  String addOrUpdateIndex(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("goods") Goods goods) throws Exception{
		if (null !=goods && null !=goods.getGoodsCode()) {
			Goods qryGoods= iGoodService.queryByCode(goods.getGoodsCode());
			request.setAttribute("qryGoods", qryGoods);
		}	
		return "/module/goods/addOrUpdateIndex.html";		
	}
	/**
	 * 功能描述：添加或修改商品信息
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月5日下午10:14:45
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/addOrUpdateGoods")
	public String addOrUpdateGoods(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("goods") Goods goods, @ModelAttribute("resp") ResponseParameterEntity resp) throws Exception{
	Integer goodsCode = goods.getGoodsCode();
	if (goodsCode != null && goodsCode > 0) {
		//修改
		iGoodService.updateGoodsByCode(goods);
		resp.setResultFlag(true);
	}else{
		//新增
		iGoodService.insertGoods(goods);
		resp.setResultFlag(true);
	}
	    success(response, resp);
		return null;
	}
	
	/**
	 * 功能描述：顾客点菜
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月5日下午10:14:45
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/addOrder")
	public String addOrUpdateOrder(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("resp") ResponseParameterEntity resp) throws Exception{
		String deskno=request.getParameter("deskno");
		String goodsCode=request.getParameter("goodsCode");
		Integer code=Integer.parseInt(goodsCode);
		String price=iGoodService.queryByCode(code).getGoodsPrice();
		//取到最后一条订单号，生成下一条订单号
		String orderNum=iOrderService.getMaxOrderNu();
		int orderNu = Integer.parseInt(orderNum);
		int ordernum=orderNu+1;
		String orderm=String.valueOf(ordernum);
		
		String selectNum=iOrderService.getOrderNum(deskno);
		
		Order order=new Order();
		
		
		if (null == selectNum) {
			order.setOrderNum(orderm);
		}else {
			order.setOrderNum(selectNum);
		}
		order.setTableCode(deskno);
		order.setGoodsCode(goodsCode);
		order.setGoodsprice(price);
		order.setTableStatus("0");
 
		order.setCreateTime(new Date());
		iOrderService.insertOrder(order);
		
		resp.setResultFlag(true);
		resp.setMessage("操作成功");
	    success(response, resp);
		return null;
	}
	
	/**
	 * 功能描述：通过Code删除
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月5日下午10:24:48
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/delGoodsByCode")
	public String delGoodsByCode(HttpServletRequest request,HttpServletResponse response,
			@ModelAttribute("recode") Goods recode,@ModelAttribute("resp") ResponseParameterEntity resp) throws Exception{
		if (null == recode || null == recode.getGoodsCode()) {
			resp.setResultFlag(false);
			resp.setMessage("请求参数为空！");
		}else {
			boolean res=iGoodService.delGoodsByCode(recode.getGoodsCode());
			resp.setResultFlag(res);
			if (!res) {
				resp.setMessage("请求处理失败，原因可能为：数据库操作失败！");
			}
		}
		success(response, resp);
		return null;
	}
}
