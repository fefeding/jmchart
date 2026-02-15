import jmSeries from './series.js';

const ANIMATION_DATA_THRESHOLD = 100;
const DEFAULT_ANIMATION_COUNT = 10;

/**
 * 柱图
 *
 * @class jmBarSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmBarSeries extends jmSeries {
	constructor(options) {
		super(options);
	}

	/**
	 * 初始化柱图
	 *
	 * @method init
	 * @for jmBarSeries
	 */
	init() {			
		const {points, dataChanged} = this.initDataPoint();				

		const len = points.length;
		if(!len) return;
		
		this.initWidth(len);
		
		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;		
		let aniIsEnd = true;
		const aniCount = (this.style.aniCount || DEFAULT_ANIMATION_COUNT);

		for(let i = 0; i < len; i++) {
			const point = points[i];
			
			if(typeof point.y === 'undefined' || point.y === null) {
				continue;
			}
			
			point.style.fill = this.getColor(point);
			const sp = this.addShape(this.graph.createPath(null, point.style));
			
			const p1 = {x: point.x - this.barTotalWidth / 2 + this.barWidth * this.barIndex, y: this.baseY };			
			const p4 = {x: p1.x + this.barWidth, y: p1.y };

			const p2 = {x: p1.x, y: p1.y };
			const p3 = {x: p4.x, y: p1.y };

			if(isRunningAni) {
				const step = point.height / aniCount;
				const offHeight = step * this.___animateCounter;
				p2.y = p1.y - offHeight;

				if((step >= 0 && p2.y <= point.y) || (step < 0 && p2.y >= point.y)) {
					p2.y = point.y;
				} else {
					aniIsEnd = false;
				}

				p3.y = p2.y;
			} else {
				p2.y = point.y;
				p3.y = point.y;					
			}

			sp.points.push(p1); 
			sp.points.push(p2); 
			sp.points.push(p3); 
			sp.points.push(p4); 

			this.createItemLabel(point);

			this.emit('onPointCreated', point);
		}

		if(aniIsEnd) {			
			this.___animateCounter = 0;
		} else {
			this.___animateCounter++;
			this.graph.utils.requestAnimationFrame(() => {
				this.needUpdate = true;
			});
		}
	}

	// 计算柱子宽度
	initWidth(count) {
		
		//计算每个柱子占宽
		//每项柱子占宽除以柱子个数,默认最大宽度为30
		const maxWidth = this.xAxis.width / count / this.graph.barSeriesCount;

		if(this.style.barWidth > 0) {
			this.barWidth = Number(this.style.barWidth);
			this.barTotalWidth = this.barWidth * this.graph.barSeriesCount;
		}
		else {
			this.barTotalWidth = (this.xAxis.width / count * (this.style.perWidth||0.4));
			this.barWidth = this.barTotalWidth / this.graph.barSeriesCount;
		}
		
		if(this.barWidth > maxWidth) {
			this.barWidth = maxWidth;
			this.barTotalWidth = maxWidth * this.graph.barSeriesCount;
		}
	}
	

	/**
	 * 在图上加下定制图形
	 * @param {jmShape} shape  图形
	 */
	 addShape(shape) {
		this.children.add(shape);
		this.shapes.add(shape);
		return shape;
	}
}