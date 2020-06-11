
import { jmPath, jmList } from '../../node_modules/jmgraph/src/core/jmGraph.js';
import jmRect from '../../node_modules/jmgraph/src/shapes/jmRect.js';

/**
 * 图形基类
 *
 * @class jmSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造线图
export default class jmSeries extends jmPath {	
	constructor(options) {
		super(options);

		this.field = options.field || '';
		this.index = options.index || 1;
		this.legendLabel = options.legendLabel || '';
	}

	/**
	 * 关联访问的是chart的数据源
	 */
	get data() {
		return this.graph.data;
	}
	set data(d) {
		this.graph.data = d;
	}

	/**
	 * 图例名称
	 *
	 * @property legendLabel
	 * @type string
	 */
	legendLabel = '';
};

/**
 * 重置属性
 * 根据数据源计算轴的属性
 *
 * @method reset
 */
jmSeries.prototype.reset = function() {	
	
	this.xAxis = this.graph.createXAxis();
	
	this.yAxis = this.yAxis || this.graph.createYAxis({
		field: this.field,
		index: this.index
	});
	
	var source = this.data;
	//计算最大值和最小值
	if(source && this.yAxis) {	
		for(var i=0;i<source.length;i++) {
			var s = source[i];					
								
			const vy = s[this.field];
			this.yAxis.max(vy);
			this.yAxis.min(vy);	
		}
	}
	//生成图例
	this.createLegend();
	return this.chartInfo = {
		xAxis: this.xAxis,
		yAxis: this.yAxis
	};
}

/**
 * 生成序列图描点
 *
 * @method createPoints
 */
jmSeries.prototype.createPoints = function(source) {
	source = source || this.data || this.graph.data;		
	if(!source) return;

	var xstep = this.xAxis.step();
	var ystep = this.yAxis.step();	

	this.points = [];
	for(var i=0;i<source.length;i++) {
		var s = source[i];
		
		var xv = s[this.xAxis.field];
		var yv = s[this.yAxis.field];

		var p = {				
			data: s,
			xValue: xv,
			xLabel: xv,
			yValue: yv,
			yLabel: yv
		};

		//字符串X轴起画点为它距左边一个单元(暂不右偏移一个单位)
		xv = this.xAxis.values.indexOf(xv);
		
		p.x = this.xAxis.start.x + this.xAxis.labelStart + (xv - this.xAxis.min()) * xstep;			

		//如果Y值不存在。则此点无效，不画图
		if(yv == null || typeof yv == 'undefined') {
			p.m = true;
		}
		else {
			if(this.yAxis.dataType != 'number') {
				yv = i;
			}
			p.y = this.yAxis.start.y - (yv - this.yAxis.min()) * ystep;
		}			
		this.points.push(p);							
	}
}

/**
 * 生成图例
 *
 * @method createLegend	 
 */
jmSeries.prototype.createLegend = function() {
	//生成图例前的图标
	const style = this.graph.utils.clone(this.style);
	style.fill = style.color;	
	//delete style.stroke;
	const shape = this.graph.createShape(jmRect,{
		style
	});
	this.graph.legend.append(this, shape);
}

/**
 * 按规则替换说明文字，把其它的特殊标记换成当前对象的值
 *
 * @method decodeTooltip
 * @param {string} tip 需要被替换的字符串
 * @param {object} item 当前点数据源 
 */
jmSeries.prototype.decodeInfo = function(info,item) {
	if(!info) info = '#X<br />#LEGENDLABEL:#Y';
	info = info.replace('#LEGENDLABEL',this.legendLabel?this.legendLabel:'')//替换图例说明关健词
			 .replace('#X',item.xLabel?item.xLabel:'')//替换X值
			 .replace('#Y',item.yLabel?item.yLabel:'');//替换Y值
	//替换掉当前点数据源的属性关健词
	for(var k in item.source) {
		info = info.replace('#DATAITEM.' + k,item.source[k]).replace('{DATA.' + k + '}',item.source[k]);
	}
	return info;
}

/**
 * 对当前图形绑定提示信息框
 *
 * @method bindTooltip
 * @param {jmControl} shape 被绑定提示的控件
 * @param {object} item 当前点数据源 
 */
jmSeries.prototype.bindTooltip = function(shape,item) {	
	shape.itemPoint = item;
	shape.tooltip = this.decodeInfo(this.tooltip,item);	
	//显示提示信息	
	shape.bind('mousemove',function(evt) {						
		this.graph.tooltip.value(this.tooltip);
		var x = evt.position.x - this.graph.tooltip.width;
		if(x < 0) {
			x = evt.position.x;
		}
		this.graph.tooltip.setPosition(x,evt.position.y + 10);
		this.graph.tooltip.show();
		//应用动态样式
		Object.assign(this.style, this.style.hover);
		this.graph.refresh();
		return false;
	});
	shape.bind('mouseleave',function(evt) {
		this.graph.tooltip.hide();
		Object.assign(this.style, this.style.normal);
		this.graph.refresh();
	});	
}



