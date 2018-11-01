package com.ordersystem.dao;

import java.util.List;

import com.ordersystem.po.Goods;

/**
 * 系统名称：餐厅点餐系统
 * 模块名称：IGoodsDao
 * 功能描述：商品管理dao
 * 模块作者：LIHEPING
 * 开发时间：2017年2月5日下午8:10:38
 * 模块路径:com.didongIndex.dao
 * 更新记录：
 */
public interface GoodsMapper  {
	// 添加
	boolean addGoods(Goods goods);

	// 查询或列表展示
	List<Goods> getGoods(Goods goods);
	
	// 通过code查询
	Goods queryGoodsByCode(Integer code);
	
	//通过Code删除
	boolean delByCode(Integer code);
	
	//更新
	boolean updateByCode(Goods goods);
}
