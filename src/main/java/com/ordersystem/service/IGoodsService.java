package com.ordersystem.service;

import java.util.List;

import com.ordersystem.po.Goods;

/**
 * 系统名称：餐厅点餐系统
 * 模块名称：IGoodsService
 * 功能描述：商品信息service接口
 * 模块作者：LIHEPING
 * 开发时间：2017年2月5日下午9:18:39
 * 模块路径:com.didongIndex.service
 * 更新记录：
 */
public interface IGoodsService  {
	// 添加
	public boolean insertGoods(Goods goods) throws Exception ;

	// 查询或列表展示
	public List<Goods> getAllGoods(Goods goods) throws Exception;
	
	// 通过code查询
	public Goods queryByCode(Integer code) throws Exception;
	
	//通过Code删除
	public boolean delGoodsByCode(Integer code) throws Exception;
	
	//更新
	public boolean updateGoodsByCode(Goods goods) throws Exception;
	

}
