import jmRect from '../../../node_modules/jmgraph/src/shapes/jmRect.js';
import jmLabel from '../../../node_modules/jmgraph/src/shapes/jmLabel.js';

/**
 * 图例的容器
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
jmLegend.prototype.append = function(series, shape, options = {}) {
	const panel = this.graph.createShape(jmRect,{
		style: this.graph.utils.clone(this.style.item),
		position: {
			x: 0,
			y: 0
		}
	});
			
	this.children.add(panel);		
	panel.children.add(shape);

	shape.width = panel.style.shape.width;
	shape.height = panel.style.shape.height;
	
	name = options.name || series.legendLabel;
	//生成图例名称
	const label = this.graph.createShape(jmLabel, {
		style: panel.style.label,
		text: name
	});		
	label.height = shape.height;
	label.position = {x: shape.width + 4, y: 0};
	panel.children.add(label);	

	//执行进入事件
	//触动图例后加粗显示图
	const hover = options.hover || function() {	
		//应用图的动态样式		
		Object.assign(series.style, series.style.hover);

		Object.assign(this.style, this.style.hover || {});

		series.graph.refresh();
	};
	panel.bind('mouseover', hover);
	//执行离开
	const leave = options.leave || function() {	
		//应用图的普通样式		
		Object.assign(series.style, series.style.normal);

		Object.assign(this.style, this.style.normal || {});
		//jmUtils.apply(this.series.style.normal,this.series.style);
		series.graph.refresh();
	};
	panel.bind('mouseleave', leave);
	
	panel.width = shape.width + label.testSize().width;
	panel.height = shape.height;

	var legendPosition = this.legendPosition || this.style.legendPosition;
	if(legendPosition == 'top' || legendPosition == 'bottom') {
		//顶部和底部图例横排，每次右移位一个单位图例
		panel.position.x = this.width + 15;
		this.width = panel.position.x + panel.width; // 把容器宽指定为所有图例宽和
		this.height = Math.max(panel.height, this.height);
	}
	else {
		//右边和左边图例竖排
		panel.position.y += this.height + 5;
		this.height = panel.position.y + panel.height;
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