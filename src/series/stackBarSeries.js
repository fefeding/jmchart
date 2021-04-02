import jmBarSeries from './barSeries.js';


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
export default class jmStackBarSeries extends jmBarSeries {
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
		//生成描点位
		const {points, dataChanged} = this.initDataPoint();				

		const len = points.length;

		this.initWidth(len);
		
		// 是否正在动画中
		// 如果数据点多于100 个，暂时不启用动画，太慢了
		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0 ) && len < 100;		
		let aniIsEnd = true;// 当次是否结束动画
		const aniCount = (this.style.aniCount || 10);

		for(let i=0; i<len; i++) {
			//const label = this.xAxis.labels[i];
			const point = points[i];			
			
			for(let index=0; index < point.points.length; index ++) {
				const style = this.graph.utils.clone(this.style);
				if(style.color && typeof style.color === 'function') {
					style.fill = style.color.call(this, this, index);
				}
				else {
					style.fill = this.graph.getColor(index);
				}
				const sp = this.shapes.add(this.graph.createPath(null, style));
				this.children.add(sp);
	
				//首先确定p1和p4,因为他们是底脚。会固定
				const p1 = {x: point.x - this.barTotalWidth / 2, y: this.baseY };			
				const p4 = {x: p1.x + this.barWidth, y: p1.y };
	
				const p2 = {x: p1.x, y: p1.y };
				const p3 = {x: p4.x, y: p1.y };
	
				// 如果要动画。则动态改变高度
				if(isRunningAni) {
					const step = point.height / aniCount;
					const offHeight = step * this.___animateCounter;// 动态计算当前高度
					p2.y = p1.y - offHeight;// 计算高度
	
					// 当次动画完成
					if((step >= 0 && p2.y <= point.y) || (step < 0 && p2.y >= point.y)) {
						p2.y = point.y;
					}
					else {
						aniIsEnd = false;// 只要有一个没完成，就还没有完成动画
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

		if(aniIsEnd) {			
			this.___animateCounter = 0;
		}
		else {
			this.___animateCounter++;
			// next tick 再次刷新
			setTimeout(()=>{
				this.needUpdate = true;//需要刷新
			});
		}
	}

	// 计算最大值和最小值，一般图形直接采用最大最小值即可，有些需要多值叠加
	initAxisValue() {
		// 计算最大最小值
		// 当前需要先更新axis的边界值，轴好画图
		const fields = Array.isArray(this.field)? this.field: [this.field];
		
		for(const row of this.data) {
			let max, min;
			for(const f of fields) {
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