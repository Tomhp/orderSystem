package com.ordersystem.dao;

import java.util.List;
import java.util.Map;

import com.ordersystem.po.Order;

public interface OrderMapper {
boolean addOrder(Order order);
String getMaxOrderNum();
//
String getOrderNum(String string);
List<Order> getOrderQuery(String string);
//减菜操作
 void deleteOrderGoods(Map<String, Object> map);
}
