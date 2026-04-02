
import jmSeries, { ANIMATION_DATA_THRESHOLD, DEFAULT_ANIMATION_COUNT } from './series.js';

/**
 * 线图
 *
 * @class jmLineSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmLineSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.line;
		super(options);
	}

	/**
	 * 初始化线条
	 *
	 * @method init
	 * @for jmLineSeries
	 */
	init() {
		const {
			points, 
			dataChanged
		} = this.initDataPoint();	

		const len = points.length;
		if(!len) return;

		this.style.stroke = this.style.color;
		this.style.item.stroke = this.style.color;

		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;

		let shapePoints = [];	
		const aniCount = (this.style.aniCount || DEFAULT_ANIMATION_COUNT);
		const aniStep = Math.floor(len / aniCount) || 1;

		for(let i = 0; i < len; i++) {
			const p = points[i];
			
			if(typeof p.y === 'undefined' || p.y === null) {
				continue;
			}

			if(isRunningAni && i > this.___animateCounter) {
				break;
			}

			if(this.style.showItem) {
				this.createPointItem(p);
			}
			
			if(this.style.curve) {
				shapePoints = this.createCurePoints(shapePoints, p);
			} else if(this.style.lineType === 'dotted') {
				shapePoints = this.createDotLine(shapePoints, p);
			}

			shapePoints.push(p);

			this.createItemLabel(p);

			this.emit('onPointCreated', p);
		}

		if(this.___animateCounter >= len - 1) {
			this.___animateCounter = 0;
		} else if(isRunningAni) {	
			this.___animateCounter += aniStep;		
			this.graph.utils.requestAnimationFrame(() => {
				this.needUpdate = true;
			});
		}

		this.points = shapePoints;
		this.createArea(shapePoints);
	}

	// 生成点的小圆圈
	createPointItem(p) {
		const pointShape = this.graph.createShape('circle', {
			style: this.style.item,
			center: p,
			radius: this.style.radius || 3
		});
	
		pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;	
		return this.addShape(pointShape);
	}

	createCurePoints(shapePoints, p) {
		const startPoint = shapePoints[shapePoints.length - 1];
		
		if(!startPoint || !p) return shapePoints;
		
		if(startPoint.x === undefined || startPoint.x === null || 
		   startPoint.y === undefined || startPoint.y === null ||
		   p.x === undefined || p.x === null ||
		   p.y === undefined || p.y === null) {
			return shapePoints;
		}

		const p1 = {x: startPoint.x + (p.x - startPoint.x) / 5, y: startPoint.y};
		const p2 = {x: startPoint.x + (p.x - startPoint.x) / 2, y: p.y - (p.y - startPoint.y) / 2};
		const p3 = {x: p.x - (p.x - startPoint.x) / 5, y: p.y};

		this.__bezier = this.__bezier || this.graph.createShape('bezier');
		this.__bezier.cpoints = [
			startPoint,
			p1,
			p2,
			p3,
			p
		];

		const bzpoints = this.__bezier.initPoints();
		if(bzpoints && bzpoints.length) {
			shapePoints = shapePoints.concat(bzpoints);
		}
		
		return shapePoints;
	}

	createDotLine(shapePoints, p) {
		const startPoint = shapePoints[shapePoints.length - 1];
		
		if(!startPoint || !p) return shapePoints;
		
		if(startPoint.x === undefined || startPoint.x === null || 
		   startPoint.y === undefined || startPoint.y === null ||
		   p.x === undefined || p.x === null ||
		   p.y === undefined || p.y === null) {
			return shapePoints;
		}

		this.__line = this.__line || this.graph.createShape('line', {
			style: this.style,						
		});	
		this.__line.start = startPoint;
		this.__line.end = p;			

		const dots = this.__line.initPoints();
		if(dots && dots.length) {
			shapePoints = shapePoints.concat(dots);
		}
		
		return shapePoints;
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend	 
	 */
	createLegend() {
		
		//生成图例前的图标
		const style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		const shape = this.graph.createShape('path',{style:style});
		
		if(this.curve || this.style.curve) {
			var p1 = {x:0,y: this.graph.style.legend.item.shape.height};
			var p2 = {x:this.graph.style.legend.item.shape.width / 3,y:this.graph.style.legend.item.shape.height/3};
			var p3 = {x:this.graph.style.legend.item.shape.width / 3 * 2,y:this.graph.style.legend.item.shape.height/3*2};
			var p4 = {x:this.graph.style.legend.item.shape.width,y:0};	

			this.__bezier = this.__bezier || this.graph.createShape('bezier');
			this.__bezier.cpoints = [
				p1,p2,p3,p4
			];//设置控制点		

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

	// 生成面积效果
	createArea(points) {
		// 有指定绘制区域效果才展示
		if(!this.style.area || points.length < 2) return;

		// 基线：取X轴的实际Y位置（chartArea相对坐标），没有X轴时用下边界
		const axisY = this.graph.xAxis 
			? this.graph.xAxis.start.y - this.graph.chartArea.position.y 
			: this.graph.chartArea.height;

		// 过滤有效点
		const validPoints = points.filter(p => p.y != null && typeof p.y !== 'undefined');
		if(validPoints.length < 2) return;

		// 检测所有点是否在基线的同一侧
		// y < axisY 表示在基线上方（数据值大于基线值），y > axisY 表示在基线下方
		let allAbove = true;
		let allBelow = true;
		for(const p of validPoints) {
			if(p.y <= axisY) allBelow = false;
			if(p.y >= axisY) allAbove = false;
		}

		if(allAbove || allBelow) {
			// 全部在基线同侧：创建单个封闭区域
			this._createAreaSegment(points, allAbove, axisY);
		} else {
			// 混合数据：在交叉点处分割，分别创建封闭区域
			this._createMixedAreas(points, axisY);
		}
	}

	/**
	 * 创建单个面积段
	 * @param {Array} points 线条上的点
	 * @param {boolean} isAbove 是否在基线上方
	 * @param {number} axisY 基线Y坐标（chartArea相对坐标）
	 */
	_createAreaSegment(points, isAbove, axisY) {
		const start = points[0];
		const end = points[points.length - 1];

		const style = this.graph.utils.clone(this.style.area, {}, true);
		// 连框颜色如果没指定，就透明
		style.stroke = style.stroke || 'transparent';

		if(!style.fill) {
			const color = this.graph.utils.hexToRGBA(this.style.stroke);
			if(isAbove) {
				// 基线上方：渐变从线条处（顶部）不透明到基线处（底部）透明
				style.fill = `linear-gradient(50% 0 50% 100%, 
					rgba(${color.r},${color.g},${color.b}, 0) 1,
					rgba(${color.r},${color.g},${color.b}, 0.1) 0.7, 
					rgba(${color.r},${color.g},${color.b}, 0.3) 0)`;
			} else {
				// 基线下方：渐变从基线处（顶部）透明到线条处（底部）不透明
				style.fill = `linear-gradient(50% 0 50% 100%, 
					rgba(${color.r},${color.g},${color.b}, 0.3) 1,
					rgba(${color.r},${color.g},${color.b}, 0.1) 0.3, 
					rgba(${color.r},${color.g},${color.b}, 0) 0)`;
			}
		}
		else if(typeof style.fill === 'function') {
			style.fill = style.fill.call(this, style, isAbove);
		}

		const area = this.graph.createShape('path', {
			points: this.graph.utils.clone(points, true),
			style,
			width: this.graph.chartArea.width,
			height: this.graph.chartArea.height
		});

		// 在首尾加上基线上的点，组成封闭多边形
		// 如果首/尾点已经在基线上（交叉点），则不重复添加
		if(Math.abs(start.y - axisY) > 0.5) {
			area.points.unshift({
				x: start.x,
				y: axisY
			});
		}
		if(Math.abs(end.y - axisY) > 0.5) {
			area.points.push({
				x: end.x,
				y: axisY
			});
		}

		this.addShape(area);
	}

	/**
	 * 处理跨基线的混合数据，在交叉点处分割成多个独立区域
	 * @param {Array} points 线条上的点
	 * @param {number} axisY 基线Y坐标（chartArea相对坐标）
	 */
	_createMixedAreas(points, axisY) {
		const segments = [];
		let currentSegment = [];
		let prevAbove = null;

		for(let i = 0; i < points.length; i++) {
			const p = points[i];
			if(p.y == null || typeof p.y === 'undefined') continue;

			const isAbove = p.y < axisY;

			if(currentSegment.length === 0) {
				currentSegment.push(p);
				prevAbove = isAbove;
			} else if(isAbove === prevAbove) {
				currentSegment.push(p);
			} else {
				// 检测到跨基线交叉：计算交叉点
				const prev = currentSegment[currentSegment.length - 1];
				const t = (axisY - prev.y) / (p.y - prev.y);
				const crossPoint = {
					x: prev.x + (p.x - prev.x) * t,
					y: axisY
				};

				// 当前段在交叉点处结束
				currentSegment.push(crossPoint);
				if(currentSegment.length >= 2) {
					segments.push({ points: [...currentSegment], above: prevAbove });
				}

				// 新段从交叉点开始
				currentSegment = [crossPoint, p];
				prevAbove = isAbove;
			}
		}

		// 最后一段
		if(currentSegment.length >= 2) {
			segments.push({ points: currentSegment, above: prevAbove });
		}

		// 为每段创建独立的面积
		for(const seg of segments) {
			this._createAreaSegment(seg.points, seg.above, axisY);
		}
	}
}
