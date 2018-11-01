package com.ordersystem.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.ordersystem.dao.GoodsMapper;
import com.ordersystem.po.Goods;
import com.ordersystem.service.IGoodsService;

/**
 * 系统名称：餐厅点餐系统
 * 模块名称：GoodsServiceImpl
 * 功能描述：商品信息管理service实现
 * 模块作者：LIHEPING
 * 开发时间：2017年2月5日下午9:26:33
 * 模块路径:com.didongIndex.service.impl
 * 更新记录：
 */
@Service("goodsService")
public class GoodsServiceImpl implements IGoodsService{
@Resource
private GoodsMapper goodsMapper;
	@Override
	public boolean insertGoods(Goods goods) throws Exception {
		return goodsMapper.addGoods(goods);
	}

	@Override
	public List<Goods> getAllGoods(Goods goods) throws Exception {
		
		return goodsMapper.getGoods(goods);
	}

	@Override
	public Goods queryByCode(Integer code) throws Exception {
		
		return goodsMapper.queryGoodsByCode(code);
	}

	@Override
	public boolean delGoodsByCode(Integer code) throws Exception {
		
		return goodsMapper.delByCode(code);
	}

	@Override
	public boolean updateGoodsByCode(Goods goods) throws Exception {
		
		return goodsMapper.updateByCode(goods);
	}

	
	

}
