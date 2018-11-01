package com.ordersystem.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.omg.CosNaming.NamingContextExtPackage.StringNameHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import com.didong.manager.frame.api.entity.ResponseParameterEntity;
import com.didong.manager.frame.spring.controller.AbstractBaseController;
import com.ordersystem.po.Goods;
import com.ordersystem.po.GoodsVo;
import com.ordersystem.po.Order;
import com.ordersystem.service.IGoodsService;
import com.ordersystem.service.IOrderService;

@Controller
@RequestMapping("/order")
public class OrderController extends AbstractBaseController {
	private final Logger logger = Logger.getLogger(OrderController.class);
	@Resource
	private IOrderService iOrderService;

	@Resource
	private IGoodsService iGoodsService;

	@RequestMapping("/orderIndex")
	public String orderIndex(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return "/order/choseTable.html";
	}

	@RequestMapping("/login")
	public String login(HttpServletRequest request, HttpServletResponse response) throws Exception {
		return "/module/user/reglogin/login.html";
	}

	/**
	 * 功能描述：前台点餐页面商品展示
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月19日下午3:21:04
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/getOrderGoodsListByTableCode")
	public String getOrderGoodsListByTableCode(HttpServletRequest request, HttpServletResponse response,
			@ModelAttribute("resp") ResponseParameterEntity resp) throws Exception {
		String tableCode = request.getParameter("tableCode");
		
		// map 用于存放 goodsCode————>sumGoodsNum 对象
		Map<String, Integer> goodsQtyMap = new HashMap<>();
		
		// list集合中有：tableCode orderNum tableStatus sumPrice sumGoodsNum goodsCode 
		List<Order> queryOrders = iOrderService.getOrder(tableCode);
		if (queryOrders != null && queryOrders.size() > 0) {
			for (Order order : queryOrders) {
				goodsQtyMap.put(order.getGoodsCode(), order.getSumGoodsNum());
			}
		}
		List<GoodsVo> goodsVoList = new ArrayList<>();

		List<Goods> goodsList = iGoodsService.getAllGoods(null);
		if (goodsList != null && goodsList.size() > 0) {
			for (Goods goods : goodsList) {
				GoodsVo vo = new GoodsVo();
				vo.setGoodsCode(goods.getGoodsCode());
				vo.setGoodsDescribe(goods.getGoodsDescribe());
				vo.setGoodsName(goods.getGoodsName());
				vo.setGoodsPrice(goods.getGoodsPrice());
				vo.setGoodsType(goods.getGoodsType());
				vo.setQty(0);
				if (goodsQtyMap.size() > 0) {
					//判断键值 goodsCode是否存在
					if (goodsQtyMap.containsKey(vo.getGoodsCode().toString())) {
						// 通过键值获取相应的sumGoodsNum
						vo.setQty(goodsQtyMap.get(vo.getGoodsCode().toString()));
					}
				}
				goodsVoList.add(vo);
			}
		}
		resp.setResultFlag(true);
		resp.setResponseEntity(goodsVoList);
		success(response, resp);
		return null;
	}

	/**
	 * 功能描述：顾客减菜
	 * 模块作者：LIHEPING
	 * 开发时间：2017年2月19日下午3:23:15
	 * 更新记录：
	 * 返回数据：String
	 */
	@RequestMapping("/delOrderGoods")
	public String delOrderGoods(HttpServletRequest request, HttpServletResponse response,
			@ModelAttribute("resp") ResponseParameterEntity resp) throws Exception {
		String tableCode = request.getParameter("deskno");
		String goodsCode = request.getParameter("goodsCode");

		boolean b = iOrderService.deleteOrderGoods(tableCode, Integer.parseInt(goodsCode));
		resp.setResultFlag(b);
		resp.setMessage("减菜成功！");
		success(response, resp);
		return null;

	}
}
