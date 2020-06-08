import jmSeries from './series.js';

/**
 * 柱图
 *
 * @class jmBarSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmBarSeries extends jmSeries {
	constructor(options) {
		super(options);
	}
	
}

/**
 * 绘制当前图形
 *
 * @method draw
 * @for jmBarSeries
 */
jmBarSeries.prototype.draw = function() {			
	var chartinfo = this.chartInfo || this.reset();	
	var source = this.source || this.chart.source;		
	if(source) {
		//生成描点位
		this.createPoints(source);
		
		//清除原有图
		var len = this.points.length;
		var shapecount = this.shapes.count();

		//清除所有现有的图形			
		for(var i=shapecount-1;i>=0;i--) {
			var shape = this.shapes.get(i);
			this.shapes.removeAt(i);
			if(shape) {
				shape.remove();
			}
		}

		//设定其填充颜色
		this.style.fill = this.style.color;	

		//计算每个柱子占宽
		//每项柱子占宽除以柱子个数,默认最大宽度为30		
		this.barTotalWidth = (this.chart.xAxis.width() / len * 0.8);
		this.barWidth = this.barTotalWidth / this.chart.barSeriesCount;
		var maxBarWidth = this.chart.barMaxWidth || 50;
		if(this.barWidth > maxBarWidth) {
			this.barWidth = maxBarWidth;
			this.barTotalWidth = maxBarWidth * this.chart.barSeriesCount;
		}
		

		var bezier;//圆滑线条使用的贝塞尔对象
		//是否启用动画效果
		var ani = typeof this.enableAnimate === 'undefined'?this.chart.enableAnimate:this.enableAnimate;
		
		for(var i=0;i<len;i++) {
			var p = this.points[i];
			
			//如果当前点无效，则跳致下一点
			if(typeof p.y == 'undefined'  || p.y == null) {
				prePoint = null;						
				continue;
			}
		
			var sp = this.shapes.add(this.chart.graph.createPath(null,jmUtils.clone(this.style)));
			this.chart.chartArea.children.add(sp);
			//绑定提示框
			this.bindTooltip(sp,p);

			//首先确定p1和p4,因为他们是底脚。会固定
			var p1 = {x: p.x - this.barTotalWidth / 2 + this.barWidth * this.barIndex, y: chartinfo.xAxis.start.y};			
			var p4 = {x: p1.x + this.barWidth, y: p1.y}
			if(ani) {
				var p2 = {x: p1.x, y: p1.y};
				var p3 = {x: p4.x, y: p1.y};

				sp.animate(function(sp,p,p2,p3,step) {
					var complete = true;
					if(p2.y < p.y) {
						p2.y = (p3.y += step);
						if(p2.y < p.y) {
							complete = false;							
						}
					}
					else if(p2.y > p.y) {
						p2.y = (p3.y += step);
						if(p2.y > p.y) {
							complete = false;							
						}
					}
					if(complete) {
						p2.y = p3.y = p.y;
					}
					return !complete;
				},50,sp,p,p2,p3,(p.y - p1.y) / 10);

				sp.points.push(p1); 
				sp.points.push(p2); 
				sp.points.push(p3); 
				sp.points.push(p4); 
			}
			else {
				var p2 = {x: p1.x, y: p.y};
				var p3 = {x: p4.x, y: p.y};
				sp.points.push(p1); 
				sp.points.push(p2); 
				sp.points.push(p3); 
				sp.points.push(p4); 
			}
		}			
	}
}
