import jmSeries, { ANIMATION_DATA_THRESHOLD, DEFAULT_ANIMATION_COUNT } from './series.js';
import jmBarSeries from './barSeries.js';

/**
 * 堆叠柱状图
 * 
 * 堆叠柱状图用于显示多个数据系列的累积效果。
 * 每个柱子由多个部分堆叠而成，每个部分代表一个数据系列。
 * 
 * 数据格式要求：
 * - field: ['value1', 'value2', 'value3'] - 多个数据字段
 * - xField: 'category' - X轴字段
 * 
 * 样式配置：
 * - barWidth: 柱子宽度（像素）
 * - perWidth: 柱子宽度占比（0-1），默认0.5
 * - color: 颜色函数，可以根据索引返回不同颜色
 * 
 * 特点：
 * - 支持正负值堆叠
 * - 正值从基线向上堆叠
 * - 负值从基线向下堆叠
 * - 支持动画效果
 *
 * @class jmStackBarSeries
 * @module jmChart
 * @extends jmBarSeries
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmStackBarSeries extends jmBarSeries {
	constructor(options) {
		super(options);
	}

	/**
	 * 初始化堆叠柱状图
	 * 
	 * 绘制逻辑：
	 * 1. 遍历所有数据点
	 * 2. 对每个数据点的多个字段进行堆叠
	 * 3. 正值向上堆叠，负值向下堆叠
	 * 4. 支持动画效果
	 */
	init() {			
		const {points, dataChanged} = this.initDataPoint();				

		const len = points.length;

		this.initWidth(len);
		
		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0 ) && len < ANIMATION_DATA_THRESHOLD;		
		let aniIsEnd = true;
		const aniCount = (this.style.aniCount || DEFAULT_ANIMATION_COUNT);

		for(let i=0; i<len; i++) {
			const point = points[i];			
			
			let topStartY = this.baseY;
			let bottomStartY = this.baseY;
			for(let index=0; index < point.points.length; index ++) {
				const p = point.points[index];

				let fillColor;
				if(this.style.color && typeof this.style.color === 'function') {
					fillColor = this.style.color.call(this, {
						index,
						point: p
					});
				}
				else {
					fillColor = this.graph.getColor(index);
				}
				// 使用浅拷贝而非深拷贝
				const style = Object.assign({}, this.style, { fill: fillColor });
				const sp = this.addShape(this.graph.createPath(null, style));				
				
				let startY = topStartY;
				if(p.yValue < this.baseYValue) startY = bottomStartY;
				
				const p1 = {x: p.x - this.barTotalWidth / 2, y: startY };			
				const p4 = {x: p1.x + this.barWidth, y: p1.y };
	
				const p2 = {x: p1.x, y: p1.y };
				const p3 = {x: p4.x, y: p1.y };
	
				if(isRunningAni) {
					const step = p.height / aniCount;
					const offHeight = step * this.___animateCounter;
					p2.y = startY - offHeight;
	
					if((step >= 0 && offHeight >= p.height) || (step < 0 && offHeight <= p.height)) {
						p2.y = startY - p.height;
					}
					else {
						aniIsEnd = false;
					}
	
					p.y = p3.y = p2.y;
				}
				else {
					p2.y = startY - p.height;
					p.y = p3.y = p2.y;					
				}

				if(p.yValue < this.baseYValue) bottomStartY = p2.y;
				else topStartY = p2.y;
	
				sp.points.push(p1); 
				sp.points.push(p2); 
				sp.points.push(p3); 
				sp.points.push(p4); 
			}			

			this.emit('onPointCreated', point);		
		}

		if(aniIsEnd) {			
			this.___animateCounter = 0;
		}
		else {
			this.___animateCounter++;
			this.graph.utils.requestAnimationFrame(()=>{
				this.needUpdate = true;
			});
		}
	}

	/**
	 * 计算最大值和最小值
	 * 
	 * 对于堆叠柱状图，需要计算所有字段的累加值
	 * 正值累加得到最大值，负值累加得到最小值
	 */
	initAxisValue() {
		const fields = Array.isArray(this.field)? this.field: [this.field];
		
		for(const row of this.data) {
			let max, min;
			for(let i=0; i<fields.length; i++) {
				const f = fields[i];
				const v = Number(row[f]);	
				if(typeof max === 'undefined') max = v;			
				else {
					if(v < 0 || max < 0) max = Math.max(max, v);
					else {
						max += v;
					}
				}
				
				if(typeof min === 'undefined') min = v;
				else {					
					if(v >= 0 || min >= 0) min = Math.min(min, v);
					else {
						min += v;
					}
				}
			}
			this.yAxis.max(max);
			this.yAxis.min(min);			

			const xv = row[this.xAxis.field]; 
			this.xAxis.max(xv);
			this.xAxis.min(xv);
		}
	}
}
