import jmRect from '../../../node_modules/jmgraph/src/shapes/jmRect.js';
import jmLabel from '../../../node_modules/jmgraph/src/shapes/jmLabel.js';

/**
 * 图例
 *
 * @class jmLegend
 * @module jmChart
 * @param {jmChart} chart 当前图表
 */

export default class jmLegend extends jmRect {

	constructor(options) {
		//当前图例位置偏移量
		options.position = options.position || {
			x: 0,
			y: 0
		};
		super(options);
	}

	/**
	 * 图例放置位置
	 */
	legendPosition = 'right';
}

/**
 * 添加图例
 *
 * @method append
 * @param {jmSeries} series 当前图序列
 * @param {jmControl} shape 当前图例的图形对象
 */
jmLegend.prototype.append = function(series,shape,name,hover,leave,target) {
	var panel = this.graph.createShape(jmRect,{
		style: this.graph.utils.clone(this.style.item)
	});
	panel.position = this.graph.utils.clone(this.position);		
	this.children.add(panel);		
	panel.children.add(shape);

	shape.width = panel.style.shape.width;
	shape.height = panel.style.shape.height;
	
	name = name || series.legendLabel;
	//生成图例名称
	var label = this.graph.createShape(jmLabel, {
		style: panel.style.label,
		value: name
	});		
	label.height = shape.height;
	label.position = {x: shape.width + 4, y: 0};
	panel.children.add(label);
	panel.series = series;//设置序列
	panel.targetShape = target;

	//执行进入事件
	//触动图例后加粗显示图
	hover = hover || function() {	
		//应用图的动态样式
		this.series.shapes.each(function(i,sp) {
			Object.assign(sp.style, sp.style.hover);
		});
		
		//jmUtils.apply(this.series.style.hover,this.series.style);
		Object.assign(this.style, this.style.hover);
		this.series.graph.refresh();
	};
	panel.bind('mouseover',hover);
	//执行离开
	leave = leave || function() {	
		//应用图的普通样式
		this.series.shapes.each(function(i,sp) {
			jmUtils.apply(sp.style.normal,sp.style);
		});
		jmUtils.apply(this.style.normal,this.style);
		//jmUtils.apply(this.series.style.normal,this.series.style);
		this.series.chart.graph.refresh();
	};
	panel.bind('mouseleave',leave);
	
	panel.width = label.position.x + label.width;
	panel.height = shape.height;

	var legendPosition = this.legendPosition || this.style.legendPosition;
	if(legendPosition == 'top' || legendPosition == 'bottom') {
		//顶部和底部图例横排，每次右移位一个单位图例
		this.position.x += panel.width + 15;
		this.width = this.position.x;
		this.height = panel.height;
	}
	else {
		//右边和左边图例竖排
		this.position.y += panel.height + 5;
		this.height = this.position.y;
		this.width = Math.max(panel.width, this.width);
	}
}

/**
 * 初始化图例
 *
 * @method init
 */
jmLegend.prototype.init = function() {
	this.position.x = 0;
	this.position.y = 0;
	this.style.lineWidth = 0;
	this.children.clear();
}

/**
 * 重置图例属性,根据图例内容计算期大小并更新画图区域大小
 *
 * @method reset
 */
jmLegend.prototype.reset = function() {
	if(this.visible !== false) {
		this.position.x = this.graph.chartArea.position.x;
		this.position.y = this.graph.chartArea.position.y;
		var legendPosition = this.legendPosition || this.style.legendPosition;
		switch(legendPosition) {
			case 'left': {
				this.graph.chartArea.width = this.graph.chartArea.width - this.width;
				//画图区域向右偏移
				this.graph.chartArea.position.x = this.position.x + this.width + this.style.margin.right;
				break;
			}
			case 'top': {
				this.graph.chartArea.height = this.graph.chartArea.height - this.height;				
				this.graph.chartArea.position.y = this.position.y + this.height + this.style.margin.bottom;
				break;
			}
			case 'bottom': {
				this.graph.chartArea.height = this.graph.chartArea.height - this.height;
				this.position.y = this.graph.chartArea.position.y + this.graph.chartArea.height + this.style.margin.top;				
				break;
			}
			case 'right': 
			default: {
				this.graph.chartArea.width = this.graph.chartArea.width - this.width;
				this.position.x = this.graph.chartArea.position.x + this.graph.chartArea.width + this.style.margin.left;
				break;
			}
		}	
	}	
}