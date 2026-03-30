import jmLineSeries from './lineSeries.js';

/**
 * 范围图（带状图）
 * 
 * 范围图用于显示数据的上下限范围，比如温度范围、价格波动范围等。
 * 它由两条线组成，两条线之间的区域用颜色填充，形成带状效果。
 * 
 * 数据格式要求：
 * - fields: ['min', 'max'] - 两个字段，分别表示下限和上限
 * - xField: 'category' - X轴字段
 * 
 * 样式配置：
 * - color: 线条和填充颜色
 * - showItem: 是否显示数据点
 * - curve: 是否使用平滑曲线
 * - area: 填充样式配置
 * 
 * 应用场景：
 * - 温度范围：显示每天的最高温和最低温
 * - 价格波动：显示股票的最高价和最低价
 * - 误差范围：显示测量值的误差范围
 * - 置信区间：显示统计数据的置信区间
 *
 * @class jmRangeSeries
 * @module jmChart
 * @extends jmLineSeries
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmRangeSeries extends jmLineSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.range || options.graph.style.stackLine;
		super(options);
	}

	/**
	 * 初始化范围图
	 * 
	 * 绘制逻辑：
	 * 1. 遍历所有数据点
	 * 2. 绘制两条线（上限线和下限线）
	 * 3. 在两条线之间创建填充区域
	 */
	init() {
		const {
			points, 
			dataChanged
		}  = this.initDataPoint();	

		const len = points.length;

		this.style.stroke = this.style.color;
		this.style.item.stroke = this.style.color;

		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0 );

		let startShapePoints = [];
		let endShapePoints = [];
		const aniCount = (this.style.aniCount || 10);
		const aniStep = Math.floor(len / aniCount) || 1;

		for(let i=0; i< len;i++) {
			const p = points[i];			

			if(isRunningAni) {
				if(i > this.___animateCounter) {
					break;
				}
			}

			if(this.style.showItem) {
				this.createPointItem(p.points[0]);
				this.createPointItem(p.points[1]);
			}
			
			if(this.style.curve) {
				startShapePoints = this.createCurePoints(startShapePoints, p.points[0]);
				endShapePoints = this.createCurePoints(endShapePoints, p.points[1]);
			}
			else if(this.style.lineType === 'dotted') {
				startShapePoints = this.createDotLine(startShapePoints, p.points[0]);
				endShapePoints = this.createDotLine(endShapePoints, p.points[1]);
			}

			startShapePoints.push(p.points[0]);
			endShapePoints.push(p.points[1]);
			

			this.emit('onPointCreated', p);
		}

		if(this.___animateCounter >= len - 1) {
			this.___animateCounter = 0;
		}
		else if(isRunningAni) {	
			this.___animateCounter += aniStep;		
			this.graph.utils.requestAnimationFrame(()=>{
				this.needUpdate = true;
			});
		}
		
		if(endShapePoints.length) endShapePoints[0].m = true;
		this.points = startShapePoints.concat(endShapePoints);	
		
		const areaPoints = startShapePoints.concat(endShapePoints.reverse());
		const areaEnd = areaPoints[areaPoints.length - 1] = this.graph.utils.clone(areaPoints[areaPoints.length - 1]);
		areaEnd.m = false;
		this.createArea(areaPoints, false);
	}

	/**
	 * 生成图例
	 */
	createLegend() {
		
		var style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		var shape = this.graph.createShape('path',{style:style});
		
		if(this.curve || this.style.curve) {
			var p1 = {x:0,y: this.graph.style.legend.item.shape.height};
			var p2 = {x:this.graph.style.legend.item.shape.width / 3,y:this.graph.style.legend.item.shape.height/3};
			var p3 = {x:this.graph.style.legend.item.shape.width / 3 * 2,y:this.graph.style.legend.item.shape.height/3*2};
			var p4 = {x:this.graph.style.legend.item.shape.width,y:0};	

			this.__bezier = this.__bezier || this.graph.createShape('bezier');
			this.__bezier.cpoints = [
				p1,p2,p3,p4
			];

			shape.points = this.__bezier.initPoints();
		}
		else {
			shape.points = [{
				x:0,y: this.graph.style.legend.item.shape.height/2
			},{
				x: this.graph.style.legend.item.shape.width,y: this.graph.style.legend.item.shape.height/2
			}];
		}
		this.graph.legend.append(this, shape);
	}
}

export {
	jmRangeSeries
}
