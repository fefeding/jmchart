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
	/**
	 * 绘制当前图形
	 *
	 * @method beginDraw
	 * @for jmBarSeries
	 */
	beginDraw() {	
		super.beginDraw();
				
		const data = this.data;		
		if(data) {
			//生成描点位
			const points = this.createPoints(data);			

			const len = points.length;

			//设定其填充颜色
			this.style.fill = this.style.color;	

			//计算每个柱子占宽
			//每项柱子占宽除以柱子个数,默认最大宽度为30		
			this.barTotalWidth = (this.xAxis.width / len * (this.style.perWidth||0.4));
			this.barWidth = this.barTotalWidth / this.graph.barSeriesCount;
			var maxBarWidth = this.graph.barMaxWidth || 50;
			if(this.barWidth > maxBarWidth) {
				this.barWidth = maxBarWidth;
				this.barTotalWidth = maxBarWidth * this.graph.barSeriesCount;
			}
			//是否启用动画效果
			var ani = typeof this.enableAnimate === 'undefined'?this.graph.enableAnimate:this.enableAnimate;
			
			for(let i=0; i<len; i++) {
				//const label = this.xAxis.labels[i];
				const point = points[i];
				
				//如果当前点无效，则跳致下一点
				if(typeof point.y === 'undefined'  || point.y === null) {
					continue;
				}
			
				var sp = this.shapes.add(this.graph.createPath(null, this.graph.utils.clone(this.style)));
				this.children.add(sp);
				//绑定提示框
				this.bindTooltip(sp, point);

				//首先确定p1和p4,因为他们是底脚。会固定
				var p1 = {x: point.x - this.barTotalWidth / 2 + this.barWidth * this.barIndex, y: this.graph.chartArea.height};			
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
					},50,sp, point,p2,p3,(point.y - p1.y) / 10);

					sp.points.push(p1); 
					sp.points.push(p2); 
					sp.points.push(p3); 
					sp.points.push(p4); 
				}
				else {
					var p2 = {x: p1.x, y: point.y};
					var p3 = {x: p4.x, y: point.y};
					sp.points.push(p1); 
					sp.points.push(p2); 
					sp.points.push(p3); 
					sp.points.push(p4); 
				}
			}			
		}
	}
}