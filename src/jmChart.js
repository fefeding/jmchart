import * as jmgraph from '../node_modules/jmgraph/src/core/jmGraph.js';
import jmRect from '../node_modules/jmgraph/src/shapes/jmRect.js';
import defaultStyle from './common/style.js';
import jmLegend from './core/legend/legend.js';
import jmBarSeries from './series/barSeries.js';
import jmPieSeries from './series/pieSeries.js';
import {
	jmLineSeries,
	jmSplineSeries
} from './series/lineSeries.js';

/**
 * jm图表组件
 * option参数:graph=jmgraph
 *
 * @class jmChart
 * @module jmChart
 * @param {element} container 图表容器
 */
export default class jmChart extends jmgraph.jmGraph  {

	constructor(container, option) {
		option = Object.assign({
			style: defaultStyle
		}, option||{});

		super(container, option);

		this.init();
	}

	/**
	 * 图序列集合
	 *
	 * @property series
	 * @type list
	 * @for jmChart
	 */
	series = new jmgraph.jmList();	

	/**
	 * 图例
	 *
	 * @property legend
	 * @type jmLegend
	 */
	legend = new jmLegend(this);

	// 初始化图表
	init() {
		/**
		 * 绘图区域
		 *
		 * @property chartArea
		 * @type jmControl
		 */
		this.chartArea = this.createShape(jmRect, {
			style: this.style.chartArea,
			position: { x: 0, y: 0}
		});
		this.graph.children.add(this.chartArea);

		/**
		 * 图表提示控件
		 *
		 * @property tooltip
		 * @type jmTooltip
		 */
		//this.tooltip = this.graph.createShape('tooltip',{style:this.style.tooltip});
		//this.chartArea.children.add(this.tooltip);
	}
}

/**
 * 获取颜色
 *
 * @method getColor 
 * @param {int} index 颜色索引
 */
jmChart.prototype.getColor = function(index) {	
	//如果颜色超过最大个数，则重新获取	
	if(index >= this.style.chartColors.length) {
		index = Math.floor((index - 1) / this.style.chartColors.length)
	}
	return this.style.chartColors[index];
}

/**
 * 绘制当前图表
 * 先绘制轴等基础信息
 *
 * @method draw 
 */
jmChart.prototype.draw = function() {
	//图排版//inside 起始点为一个单位，否则为原点
	this.layout = this.style.layout;
	//重置图例
	this.legend.init();

	if(this.xAxis) {
		this.xAxis.clear();
	}

	//计算Y轴位置
	if(this.yAxises) {
		for(var i in this.yAxises) {
			this.yAxises[i].clear();
		}
	}

	//先定位图例等信息，确定画图区域
	this.resetAreaPosition();
	//计算柱形图个数
	this.barSeriesCount = 0;
	//初始化图序列，并初始化轴值,生成图例项
	this.series.each(function(i, serie) {
		//设定边框颜色和数据项图示颜 色
		serie.style.color = serie.graph.getColor(i);
		//如果没有指定图排版方式，则如果有非线图，就表示默认为inside
		if(!serie.graph.layout) {
			if(!serie.graph.utils.isType(serie, jmLineSeries) && 
				!serie.graph.utils.isType(serie, jmSplineSeries)) {			
					serie.graph.layout = 'inside';
			}
		}
		
		//对柱图计算,并标记为第几个柱图，用为排列
		if(serie.graph.utils.isType(serie, jmBarSeries)) {
			serie.barIndex = serie.graph.barSeriesCount;
			serie.graph.barSeriesCount ++;
		}
		serie.reset();
	});	

	//图例重置，它会更新画图区域属性
	this.legend.reset();

	//计算轴信息
	if(this.xAxis) {
		this.xAxis.reset();
	}
	//计算Y轴位置
	if(this.yAxises) {
		for(var i in this.yAxises) {
			this.yAxises[i].reset();
		}
	}
	
/*
	this.series.each(function(i,series) {
		series.createPoints();
	});	*/

	this.series.each(function(i,series) {
		series.draw();
	});	

	if(this.xAxis) {
		this.xAxis.draw();
	}

	//计算Y轴位置
	if(this.yAxises) {
		for(var i in this.yAxises) {
			this.yAxises[i].draw();
		}
	}
	this.graph.refresh();
}

/**
 * 重新定位区域的位置
 *
 * @method resetAreaPosition
 */
jmChart.prototype.resetAreaPosition = function () {
	this.chartArea.position.x = this.style.margin.left;
	this.chartArea.position.y = this.style.margin.top;
	var w = this.width - this.style.margin.right - this.chartArea.position.x;
	var h = this.height - this.style.margin.bottom - this.chartArea.position.y;

	this.chartArea.width = w;
	this.chartArea.height = h;
}

/**
 * 创建轴
 *
 * @method createAxis
 * @for jmChart
 * @param {string} [type] 轴类型(x/y/radar),默认为x
 * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
 * @param {object} [style] 样式
 * @return {axis} 轴
 */
jmChart.prototype.createAxis = function (type,dataType,style) {
	return new jmAxis(this,type,dataType);
}

/**
 * 生成X轴
 *
 * @method createXAxis
 * @param {string} x轴的数据类型(string/number/date)
 * @param {bool} 是否从0开始
 */ 
jmChart.prototype.createXAxis = function(type,zeroBase) {
	if(!this.xAxis) {
		this.xAxis = this.createAxis('x',type);
	}
	this.xAxis.zeroBase = this.xAxis.zeroBase || zeroBase;
	return this.xAxis;
}

/**
 * 生成Y轴
 *
 * @method createYAxis
 * @param {int} Y轴索引，可以创建多个Y轴
 * @param {string} y轴的数据类型(string/number/date)
 * @param {bool} 是否从0开始
 */ 
jmChart.prototype.createYAxis = function(index,type,zeroBase) {
	index = index ||1;
	if(!this.yAxises) {
		this.yAxises = {};		
	}
	var yaxis = this.yAxises[index] || (this.yAxises[index] = this.createAxis('y',type));
	yaxis.zeroBase = yaxis.zeroBase || zeroBase;
	yaxis.index = index;
	return yaxis;
}

/**
 * 创建图形
 *
 * @method createSeries
 * @for jmChart
 * @param {string} [type] 图类型，（line/bar/pie/radar）
 * @param {array} [mappings] 字段映射对象
 * @param {object} [style] 样式
 * @return {series} 图形
 */
jmChart.prototype.createSeries = function (type,mappings,style) {
	if(!this.serieTypes) {
		this.serieTypes = {
			'line' : jmLineSeries,
			'spline' : jmSplineSeries,
			'bar' : jmBarSeries,
			'pie' : jmPieSeries
		};		
	}
	//默认样式为类型对应的样式
	style = style || this.graph.utils.clone(this.style[type]);
	return new this.serieTypes[type](this, mappings, style);
}