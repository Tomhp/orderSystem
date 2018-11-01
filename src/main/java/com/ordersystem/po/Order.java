package com.ordersystem.po;


import java.util.Date;



public class Order {
private Integer id;
private String tableCode;
private String orderNum;
private String goodsCode;
private String goodsPrice;
private String tableStatus;
private Date createTime;
private Integer sumGoodsNum;  
public Integer getId() {
	return id;
}
public void setId(Integer id) {
	this.id = id;
}
public String getTableCode() {
	return tableCode;
}
public void setTableCode(String tableCode) {
	this.tableCode = tableCode;
}

public String getOrderNum() {
	return orderNum;
}
public void setOrderNum(String orderNum) {
	this.orderNum = orderNum;
}
public String getGoodsCode() {
	return goodsCode;
}
public void setGoodsCode(String goodsCode) {
	this.goodsCode = goodsCode;
}
public String getGoodsprice() {
	return goodsPrice;
}
public void setGoodsprice(String goodsprice) {
	this.goodsPrice = goodsprice;
}
public String getTableStatus() {
	return tableStatus;
}
public void setTableStatus(String tableStatus) {
	this.tableStatus = tableStatus;
}
public Date getCreateTime() {
	return createTime;
}
public void setCreateTime(Date createTime) {
	this.createTime = createTime;
}
public Integer getSumGoodsNum() {
	return sumGoodsNum;
}
public void setSumGoodsNum(Integer sumGoodsNum) {
	this.sumGoodsNum = sumGoodsNum;
}



}
