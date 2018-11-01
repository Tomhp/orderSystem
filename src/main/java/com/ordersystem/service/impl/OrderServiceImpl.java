package com.ordersystem.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ordersystem.dao.OrderMapper;
import com.ordersystem.po.Goods;
import com.ordersystem.po.Order;
import com.ordersystem.service.IOrderService;

@Service("orderService")
public class OrderServiceImpl implements IOrderService{
    @Resource
    private OrderMapper ordermapper;
	@Override
	public boolean insertOrder(Order order) throws Exception {
		return ordermapper.addOrder(order);
	}
	@Override
	public String getMaxOrderNu() throws Exception {
		return ordermapper.getMaxOrderNum();
	}
	@Override
	public String getOrderNum(String string) throws Exception {
		return ordermapper.getOrderNum(string);
	}
	@Override
	public List<Order> getOrder(String string) throws Exception {
		return ordermapper.getOrderQuery(string);
	}
	@Override
	public boolean deleteOrderGoods(String tableCode, Integer goodsCode) throws Exception {
		Map<String, Object> map=new HashMap<>();
		map.put("tableCode", tableCode);
		map.put("goodsCode", goodsCode);
		ordermapper.deleteOrderGoods(map);
		return true;
	}
	
}
