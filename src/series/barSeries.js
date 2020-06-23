import jmSeries from './series.js';
import utils from '../common/utils.js';


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
	init() {
				
		const data = this.data;		
		if(data) {
			
			//生成描点位
			let points;	

			// 如果有动画，则需要判断是否改变，不然不需要重新动画
			let dataChanged = false;
			if(this.enableAnimate) {
				// 拷贝一份上次的点集合，用于判断数据是否改变
				const lastPoints = this.graph.utils.clone(this.dataPoints, true);

				// 重新生成描点
				points = this.createPoints(data);

				dataChanged = utils.arrayIsChange(lastPoints, points, (s, t) => {
					return s.x === t.x && s.y === t.y;
				});
			}	
			else {
				points = this.createPoints(data);
			}

			const len = points.length;

			//设定其填充颜色
			this.style.fill = this.style.color;	

			//计算每个柱子占宽
			//每项柱子占宽除以柱子个数,默认最大宽度为30		
			this.barTotalWidth = (this.xAxis.width / len * (this.style.perWidth||0.4));
			this.barWidth = this.barTotalWidth / this.graph.barSeriesCount;
			const maxBarWidth = this.graph.barMaxWidth || 50;
			if(this.barWidth > maxBarWidth) {
				this.barWidth = maxBarWidth;
				this.barTotalWidth = maxBarWidth * this.graph.barSeriesCount;
			}
			
			
			for(let i=0; i<len; i++) {
				//const label = this.xAxis.labels[i];
				const point = points[i];
				
				//如果当前点无效，则跳致下一点
				if(typeof point.y === 'undefined'  || point.y === null) {
					continue;
				}
			
				const sp = this.shapes.add(this.graph.createPath(null, this.graph.utils.clone(this.style)));
				this.children.add(sp);
				//绑定提示框
				//this.bindTooltip(sp, point);

				//首先确定p1和p4,因为他们是底脚。会固定
				const p1 = {x: point.x - this.barTotalWidth / 2 + this.barWidth * this.barIndex, y: this.graph.chartArea.height};			
				const p4 = {x: p1.x + this.barWidth, y: p1.y };

				const p2 = {x: p1.x, y: p1.y };
				const p3 = {x: p4.x, y: p1.y };

				// 如果要动画。则动态改变高度
				if(this.enableAnimate && (dataChanged || this.___animateCounter > 0 )) {
					const height = Math.abs(point.y - p1.y);
					const step = height / 50;

					const offHeight = step * this.___animateCounter;// 动态计算当前高度

					// 当次动画完成
					if(offHeight >= height) {
						p2.y = point.y;
						this.___animateCounter = 0;
					}
					else {
						this.___animateCounter++;
						p2.y = p1.y - offHeight;// 计算高度
						// next tick 再次刷新
						setTimeout(()=>{
							this.needUpdate = true;//需要刷新
						});
					}

					p3.y = p2.y;
				}
				else {
					p2.y = point.y;
					p3.y = point.y;					
				}

				sp.points.push(p1); 
				sp.points.push(p2); 
				sp.points.push(p3); 
				sp.points.push(p4); 
			}			
		}
	}
}