package com.ordersystem.service;

import java.util.List;

import com.ordersystem.po.Order;

public interface IOrderService {
	public boolean insertOrder(Order order) throws Exception ;
	public String getMaxOrderNu() throws Exception;
	public String  getOrderNum(String string) throws Exception;
	public List<Order> getOrder(String string)throws Exception;
	boolean deleteOrderGoods(String tableCode, Integer goodsCode) throws Exception;
}
