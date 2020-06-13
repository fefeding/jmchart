
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

		this.xAxis = this.graph.createXAxis(); // 生成X轴
		
		// 生成当前Y轴
		this.yAxis = this.yAxis || this.graph.createYAxis({
			index: this.index,
			format: options.yLabelFormat
		});
		// 初始化一些参数， 因为这里有多个Y轴的可能，所以每次都需要重调一次init
		this.yAxis.init({
			field: this.field,
			minYValue: options.minYValue,
			maxYValue: options.maxYValue
		});
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

	/**
	 * 当前图形下的所有子图
	 */
	shapes = new jmList();

	// 图绑定的属性名
	field = '';
};

/**
 * 重置属性
 * 根据数据源计算轴的属性
 *
 * @method reset
 */
jmSeries.prototype.reset = function() {	

	//生成图例
	this.createLegend();

	// 重置所有图形
	var shape;
	while(shape = this.shapes.shift()) {
		shape && shape.remove();
	}

	// 计算最大最小值
	// 当前需要先更新axis的边界值，轴好画图
	for(var i=0; i< this.data.length;i++) {	
		const v = this.data[i][this.field]; 
		this.yAxis.max(v);
		this.yAxis.min(v);

		const xv = this.data[i][this.xAxis.field]; 
		this.xAxis.max(xv);
		this.xAxis.min(xv);
	}

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
jmSeries.prototype.createPoints = function(data) {
	data = data || this.data;		
	if(!data) return;

	//var xstep = this.xAxis.step();
	var ystep = this.yAxis.step();	

	const points = [];
	for(var i=0;i < data.length; i++) {
		var s = data[i];
		
		var xv = s[this.xAxis.field];
		var yv = s[this.field];

		var p = {				
			data: s,
			xValue: xv,
			xLabel: xv,
			yValue: yv,
			yLabel: yv
		};
		
		// 这里的点应相对于chartArea
		const xpoint = this.xAxis.labels[i];
		p.x = xpoint.position.x + xpoint.width / 2;			

		//如果Y值不存在。则此点无效，不画图
		if(yv == null || typeof yv == 'undefined') {
			p.m = true;
		}
		else {
			if(this.yAxis.dataType != 'number') {
				yv = i;
			}
			p.y = this.graph.chartArea.height - (yv - this.yAxis.min()) * ystep;
		}			
		points.push(p);							
	}
	return points;
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
 * 对当前图形绑定提示信息框
 *
 * @method bindTooltip
 * @param {jmControl} shape 被绑定提示的控件
 * @param {object} item 当前点数据源 
 */
jmSeries.prototype.bindTooltip = function(shape, item) {	
	shape.itemPoint = item;
	//shape.tooltip = this.decodeInfo(this.tooltip, item);	
	//显示提示信息	
	shape.bind('mousemove touchmove', (evt) => {						
		/*this.graph.tooltip.value(this.tooltip);
		var x = evt.position.x - this.graph.tooltip.width;
		if(x < 0) {
			x = evt.position.x;
		}
		this.graph.tooltip.setPosition(x,evt.position.y + 10);
		this.graph.tooltip.show();*/
		//应用动态样式
		//this.style.hover && Object.assign(this.style, this.style.hover);
		//.graph.refresh();
		console.log(item, this);
		return false;
	});
	shape.bind('mouseleave touchend touchcancel',(evt) => {
		/*this.graph.tooltip.hide();*/
		//this.style.normal && Object.assign(this.style, this.style.normal);
		//this.graph.refresh();
	});	
}



