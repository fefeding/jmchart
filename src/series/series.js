
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

		this.init(options);
	}
};


/**
 * 初始化
 *
 * @method init
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */
jmSeries.prototype.init = function(options) {
	if(!this.shapes) {
		this.shapes = new jmList();
	}

	/**
	 * 当前图形字段映射
	 *
	 * @property mappings
	 * @type array
	 */
	this.mappings = new jmList(options.mappings || {});

	/**
	 * 图例名称
	 *
	 * @property legendLabel
	 * @type string
	 */
	this.legendLabel = '';

	/**
	 * 当前图形数据源，默认使用chart的源，除非需要单独设置此数据源
	 *
	 * @property source
	 * @type array
	 */
	this.source = options.source;
}

/**
 * 重置属性
 * 根据数据源计算轴的属性
 *
 * @method reset
 */
jmSeries.prototype.reset = function() {
	var xmapping;
	var ymapping;
	this.mappings.each(function(i,m) {
		if(m.type == 'x') {
			xmapping = m;
		}
		else if(m.type == 'y') {
			ymapping = m;
		}
		//如果都已确定则退出循 环
		if(xmapping && ymapping) return false;
	});
	
	//创建X轴
	if(xmapping) {
		var xaxis = this.graph.createXAxis(xmapping.dataType,xmapping.zeroBase);
		//格式化属性
		if(xmapping.format) {
			xaxis.format = xmapping.format;
		}
	}
	//创建Y轴
	if(ymapping) {
		var yaxis = this.graph.createYAxis(ymapping.index,ymapping.dataType,ymapping.zeroBase);
	}
	var source = this.source || this.graph.source;
	//计算最大值和最小值
	if(source) {
		var ycatCount;		
		for(var i=0;i<source.length;i++) {
			var s = source[i];					
			if(xaxis) {
				var vx = s[xmapping.field];	
				//如果为日期，则转为毫秒数
				if(xmapping.dataType == 'date') {
					vx = this.graph.utils.parseDate(vx);
					vx = vx.getTime();
				}
				//如果为字符串或日期，则把每个分类加到X轴中					
				if(xmapping.dataType !== 'number') {
					if(this.graph.utils.indexOf(vx,xaxis.values) == -1) {
						xaxis.values.push(vx);
					}
				}

				//不为字符串时要收集最大值和最小值
				if(xmapping.dataType !== 'string') {
					xaxis.max(vx);
					xaxis.min(vx);
				}
			}
			if(yaxis) {						
				var vy = s[ymapping.field];
				if(ymapping.dataType == 'number') {
					yaxis.max(vy);
					yaxis.min(vy);
				}
				//如果y轴为字符串或日期，则计算分类个数
				else {
					if(!ycatCount) ycatCount = {'__count':0};
					if(!ycatCount[vy]) {
						ycatCount[vy] = 1;
						ycatCount.__count++;
						if(this.graph.utils.indexOf(vy,yaxis.values) == -1) {
							yaxis.values.push(vy);
						}
					}
				}
			}
		}
		//如果为分类则计算为分类个数
		if(ycatCount) {
			yaxis.max(ycatCount.__count);
			yaxis.min(0);
		}
	}
	//生成图例
	this.createLegend();
	return this.chartInfo = {xMapping:xmapping,yMapping:ymapping,xAxis:xaxis,yAxis:yaxis};
}

/**
 * 生成序列图描点
 *
 * @method createPoints
 */
jmSeries.prototype.createPoints = function(source) {
	source = source || this.source || this.graph.source;		
	if(!source) return;

	var chartinfo = this.chartInfo;
	var xstep = chartinfo.xAxis.step();
	var ystep = chartinfo.yAxis.step();
	
	//按X轴大小排序
	if(chartinfo.xMapping && chartinfo.xMapping.datType != 'string') {
		source.sort(function(s1,s2) {
			var x1 = s1[chartinfo.xMapping.field];
			var x2 = s2[chartinfo.xMapping.field];
			return x1>x2?1:-1;
		});
	}

	//初始化格式串
	chartinfo.xMapping.format = chartinfo.xMapping.format || 'yyyy-MM-dd HH:mm:ss';
	chartinfo.yMapping.format = chartinfo.yMapping.format || 'yyyy-MM-dd HH:mm:ss';

	this.points = [];
	for(var i=0;i<source.length;i++) {
		var s = source[i];
		
		var xv = s[chartinfo.xMapping.field];
		var yv = s[chartinfo.yMapping.field];

		var p = {				
			source: s,
			xValue: xv,
			xLabel: xv,
			yValue: yv,
			yLabel: yv
		};

		if(chartinfo.xMapping.dataType == 'date') {
			xv = this.graph.utils.parseDate(xv);
			xv = xv.getTime();
			p.xLabel = this.graph.utils.formatDate(xv,chartinfo.xMapping.format);			
		}
		//字符串X轴起画点为它距左边一个单元(暂不右偏移一个单位)
		else if(chartinfo.xMapping.dataType == 'string') {
			xv = this.graph.utils.indexOf(xv,chartinfo.xAxis.values);
		}
		
		if(chartinfo.yMapping.dataType == 'date') {
			yv = this.graph.utils.parseDate(yv);
			yv = yv.getTime();
			p.yLabel = this.graph.utils.formatDate(yv,chartinfo.yMapping.format);		
		}
		
		
		p.x = chartinfo.xAxis.start.x + chartinfo.xAxis.labelStart + (xv - chartinfo.xAxis.min()) * xstep;			

		//如果Y值不存在。则此点无效，不画图
		if(yv == null || typeof yv == 'undefined') {
			p.m = true;
		}
		else {
			if(chartinfo.yMapping.dataType == 'string') {
				yv = this.graph.utils.indexOf(yv,chartinfo.yAxis.values);
			}
			p.y = chartinfo.yAxis.start.y - (yv - chartinfo.yAxis.min()) * ystep;
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
	var style = this.graph.utils.clone(this.style);
	style.fill = style.color;	
	//delete style.stroke;
	var shape = this.graph.createShape(jmRect,{
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
		var x = evt.position.x - this.graph.tooltip.width();
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



