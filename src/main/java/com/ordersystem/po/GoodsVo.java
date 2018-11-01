package com.ordersystem.po;

/**
 * 系统名称：餐厅点餐系统
 * 模块名称：GoodsVo
 * 功能描述：商品实体包装类
 * 模块作者：LIHEPING
 * 开发时间：2017年2月5日下午7:58:42
 * 模块路径:com.didongIndex.po
 * 更新记录：
 */
public class GoodsVo {
	private Integer goodsCode;// 商品编号
	private String goodsName;// 商品名称
	private String goodsType;// 商品类型
	private String goodsPrice;// 商品价格
	private String goodsDescribe;// 描述 
	private int qty;//	份数
	public Integer getGoodsCode() {
		return goodsCode;
	}
	public void setGoodsCode(Integer goodsCode) {
		this.goodsCode = goodsCode;
	}
	public String getGoodsName() {
		return goodsName;
	}
	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName == null ? null:goodsName.trim();
	}
	public String getGoodsType() {
		return goodsType;
	}
	public void setGoodsType(String goodsType) {
		this.goodsType = goodsType == null ? null:goodsType.trim();
	}
	public String getGoodsPrice() {
		return goodsPrice;
	}
	public void setGoodsPrice(String goodsPrice) {
		this.goodsPrice = goodsPrice == null ? null:goodsPrice.trim();
	}
	public String getGoodsDescribe() {
		return goodsDescribe;
	}
	public void setGoodsDescribe(String goodsDescribe) {
		this.goodsDescribe = goodsDescribe == null ? null:goodsDescribe.trim();
	}
	public int getQty() {
		return qty;
	}
	public void setQty(int qty) {
		this.qty = qty;
	}

	
}
