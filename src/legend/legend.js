
/**
 * 图例
 *
 * @class jmLegend
 * @module jmChart
 * @param {jmChart} chart 当前图表
 */

function jmLegend(chart) {
	/**
	 * 当前轴所在的图表
	 *
	 * @property chart
	 * @type jmChart
	 */
	this.chart = chart;

	/**
	 * 图例样式
	 *
	 * @property style
	 * @type object
	 */
	this.style = chart.style.legend;

	/**
	 * 图例容器
	 *
	 * @property area
	 * @type jmControl
	 */
	this.area = chart.graph.createShape('rect',{style:this.style});

	//添加至画布中
	chart.graph.children.add(this.area);

	//当前图例位置偏移量
	this.currentPosition = {x:0,y:0};
}

/**
 * 添加图例
 *
 * @method append
 * @param {jmSeries} series 当前图序列
 * @param {jmControl} shape 当前图例的图形对象
 */
jmLegend.prototype.append = function(series,shape,name,hover,leave,target) {
	var panel = this.chart.graph.createShape('rect',{style: jmUtils.clone(this.style.item)});
	panel.position(jmUtils.clone(this.currentPosition));		
	this.area.children.add(panel);		
	panel.children.add(shape);

	shape.width(panel.style.shape.width);
	shape.height(panel.style.shape.height);
	
	name = name || series.legendLabel;
	//生成图例名称
	var label = this.chart.graph.createShape('label',{style:panel.style.label,value:name});		
	label.height(shape.height());
	label.position({x:shape.width() + 4,y:0});
	panel.children.add(label);
	panel.series = series;//设置序列
	panel.targetShape = target;

	//执行进入事件
	//触动图例后加粗显示图
	hover = hover || function() {	
		//应用图的动态样式
		this.series.shapes.each(function(i,sp) {
			jmUtils.apply(sp.style.hover,sp.style);
		});
		
		//jmUtils.apply(this.series.style.hover,this.series.style);
		jmUtils.apply(this.style.hover,this.style);
		this.series.chart.graph.refresh();
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
	
	panel.width(label.position().x + label.width());
	panel.height(shape.height());

	var position = this.position || this.style.position;
	if(position == 'top' || position == 'bottom') {
		//顶部和底部图例横排，每次右移位一个单位图例
		this.currentPosition.x += panel.width() + 15;
		this.width(this.currentPosition.x);
		this.height(panel.height());
	}
	else {
		//右边和左边图例竖排
		this.currentPosition.y += panel.height() + 5;
		this.height(this.currentPosition.y);
		this.width(Math.max(panel.width(),this.width()));
	}
}

/**
 * 初始化图例
 *
 * @method init
 */
jmLegend.prototype.init = function() {
	this.currentPosition.x = 0;
	this.currentPosition.y = 0;
	this.area.visible = this.visible;//设置是否可视
	this.area.style.lineWidth = 0;
	this.area.children.clear();
}

/**
 * 重置图例属性,根据图例内容计算期大小并更新画图区域大小
 *
 * @method reset
 */
jmLegend.prototype.reset = function() {
	if(this.visible !== false) {
		this.location().x = this.chart.chartArea.position().x;
		this.location().y = this.chart.chartArea.position().y;
		var position = this.position || this.style.position;
		switch(position) {
			case 'left': {
				this.chart.chartArea.width(this.chart.chartArea.width() - this.width());
				//画图区域向右偏移
				this.chart.chartArea.position().x = this.location().x + this.width() + this.style.margin.right;
				break;
			}
			case 'top': {
				this.chart.chartArea.height(this.chart.chartArea.height() - this.height());				
				this.chart.chartArea.position().y = this.location().y + this.height() + this.style.margin.bottom;
				break;
			}
			case 'bottom': {
				this.chart.chartArea.height(this.chart.chartArea.height() - this.height());
				this.location().y = this.chart.chartArea.position().y + this.chart.chartArea.height() + this.style.margin.top;				
				break;
			}
			case 'right': 
			default: {
				this.chart.chartArea.width(this.chart.chartArea.width() - this.width());
				this.location().x = this.chart.chartArea.position().x + this.chart.chartArea.width() + this.style.margin.left;
				break;
			}
		}	
	}	
}

/**
 * 获取或设置位置
 *
 * @method location
 * @param {point} p 位置坐标
 * @return {point} 当前位置
 */
jmLegend.prototype.location = function(p) {
	return this.area.position(p);
}

/**
 * 获取或设置宽度
 *
 * @method width
 * @param {number} w 宽度
 * @return {number} 当前宽度
 */
jmLegend.prototype.width = function(w) {
	return this.area.width(w);
}

/**
 * 获取或设置高度
 *
 * @method height
 * @param {number} h 高度
 * @return {number} 当前高度
 */
jmLegend.prototype.height = function(h) {
	return this.area.height(h);
}
