import * as jmgraph from '../node_modules/jmgraph/src/core/jmGraph.js';
import jmRect from '../node_modules/jmgraph/src/shapes/jmRect.js';
import defaultStyle from './common/style.js';
import jmAxis from './core/axis/axis.js';
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

		this.data = option.data || [];
		// x轴绑定的字段名
		this.xField = option.xField || '';

		this.init();
	}

	/**
	 * 绑定的数据源
	 */
	data = [];	

	/**
	 * 当前所有图
	 */
	series = new jmgraph.jmList();

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
		this.children.add(this.chartArea);

		/**
		 * 图例
		 *
		 * @property legend
		 * @type jmLegend
		 */
		this.legend = this.createShape(jmLegend, {
			style: this.style.legend
		});
		this.children.add(this.legend);

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
 * @method beginDraw 
 */
jmChart.prototype.beginDraw = function() {
	//图排版//inside 起始点为一个单位，否则为原点
	this.layout = this.style.layout;
	
	//重置图例
	this.legend.init();

	//先定位图例等信息，确定画图区域
	this.resetAreaPosition();

	if(this.xAxis) {
		this.xAxis.clear();
	}

	//计算Y轴位置
	if(this.yAxises) {
		for(var i in this.yAxises) {
			this.yAxises[i].clear();
		}
	}

	
	//计算柱形图个数
	this.barSeriesCount = 0;
	//初始化图序列，并初始化轴值,生成图例项
	this.series.each(function(i, serie) {
		//设定边框颜色和数据项图示颜 色
		serie.style.color = serie.style.color || serie.graph.getColor(i);
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
	
	//重置图例
	this.legend.reset();	

	if(this.xAxis) {
		this.xAxis.reset();
	}

	//计算Y轴位置
	if(this.yAxises) {
		for(var i in this.yAxises) {
			this.yAxises[i].reset();
		}
	}

	//最后再来初始化图形，这个必须在轴初始化完后才能执行
	this.series.each(function(i, serie) {		
		serie.init && serie.init();
	});	
}

/**
 * 重新定位区域的位置
 *
 * @method resetAreaPosition
 */
jmChart.prototype.resetAreaPosition = function () {
	this.chartArea.position.x = this.style.margin.left || 0;
	this.chartArea.position.y = this.style.margin.top || 0;
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
jmChart.prototype.createAxis = function (options) {
	options.style = options.style || this.style.axis;
	const axis = this.createShape(jmAxis, options);
	this.children.add(axis);
	return axis;
}

/**
 * 生成X轴
 *
 * @method createXAxis
 * @param {string} x轴的数据类型(string/number/date)
 * @param {bool} 是否从0开始
 */ 
jmChart.prototype.createXAxis = function(options) {
	if(!this.xAxis) {
		options = Object.assign({
			field: this.xField,
			type: 'x'
		}, options);
		this.xAxis = this.createAxis(options);
	}
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
jmChart.prototype.createYAxis = function(options) {
	options.index = options.index ||1;
	options.type = 'y';

	if(!this.yAxises) {
		this.yAxises = {};		
	}
	var yaxis = this.yAxises[options.index] || (this.yAxises[options.index] = this.createAxis(options));
	return yaxis;
}

/**
 * 创建图形
 *
 * @method createSeries
 * @for jmChart
 * @param {string} [type] 图类型，（line/bar/pie/radar）
 * @param {object} [options] 生成图表选项 {xField, yField, index}
 * @return {series} 图形
 */
jmChart.prototype.createSeries = function (type, options = {}) {
	if(!this.serieTypes) {
		this.serieTypes = {
			'line' : jmLineSeries,
			'spline' : jmSplineSeries,
			'bar' : jmBarSeries,
			'pie' : jmPieSeries
		};		
	}

	//默认样式为类型对应的样式
	const style = this.style[type] || this.style['line'];
	options.style = Object.assign(this.utils.clone(style), options.style || {});

	if(typeof type == 'string') type = this.serieTypes[type];
	
	const serie = this.createShape(type, options);
	if(serie) {
		this.series.add(serie);
		this.chartArea.children.add(serie);
	}
	return serie;
}