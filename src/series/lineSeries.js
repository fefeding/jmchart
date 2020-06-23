import jmBezier from 'jmgraph/src/shapes/jmBezier.js';
import jmArc from 'jmgraph/src/shapes/jmArc.js';
import jmPath from 'jmgraph/src/core/jmPath.js';
import jmSeries from './series.js';
import utils from '../common/utils.js';

/**
 * 图形基类
 *
 * @class jmLineSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmLineSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.line;
		super(options);

		//this.on('beginDraw', this[PreDrawKey]);
	}

	/**
	 * 绘制图形前 初始化线条
	 *
	 * @method preDraw
	 * @for jmLineSeries
	 */
	init() {
		//生成描点位
		let points;	

		// 如果有动画，则需要判断是否改变，不然不需要重新动画
		let dataChanged = false;
		if(this.enableAnimate) {
			// 拷贝一份上次的点集合，用于判断数据是否改变
			const lastPoints = this.graph.utils.clone(this.dataPoints, true);

			// 重新生成描点
			points = this.createPoints();

			dataChanged = utils.arrayIsChange(lastPoints, points, (s, t) => {
				return s.x === t.x && s.y === t.y;
			});
		}	
		else {
			points = this.createPoints();
		}

		//去除多余的线条
		//当数据源线条数比现有的少时，删除多余的线条
		const len = points.length;

		//设定其填充颜色
		//if(!this.style.fill) this.style.fill = jmUtils.toColor(this.style.stroke,null,null,20);	
		this.style.stroke = this.style.color;
		//是否启用动画效果
		//var ani = typeof this.enableAnimate === 'undefined'? this.graph.enableAnimate: this.enableAnimate;
		this.style.item.stroke = this.style.color;

		let shapePoints = []; // 计算出来的曲线点集合			
		
		for(var i=0; i< len;i++) {
			const p = points[i];
			
			//如果当前点无效，则跳致下一点
			if(typeof p.y === 'undefined'  || p.y === null) {
				//prePoint = null;						
				continue;
			}

			// 当前线条描点，如果有动画是不一样的
			const linePoint = {
				x: p.x,
				y: this.graph.chartArea.height
			};

			// 如果要动画。则动态改变高度
			if(this.enableAnimate && (dataChanged || this.___animateCounter > 0 )) {
				const height = Math.abs(p.y - linePoint.y);
				const step = height / 100;

				const offHeight = step * this.___animateCounter;// 动态计算当前高度

				// 当次动画完成
				if(offHeight >= height) {
					linePoint.y = p.y;
					this.___animateCounter = 0;
				}
				else {
					this.___animateCounter++;
					linePoint.y -= offHeight;// 计算高度
					// next tick 再次刷新
					setTimeout(()=>{
						this.needUpdate = true;//需要刷新
					});
				}
			}
			else {
				linePoint.y = p.y;		
			}

			// 是否显示数值点圆
			if(this.style.showItem) {
				const pointShape = this.graph.createShape(jmArc,{
					style: this.style.item,
					center: linePoint,
					radius: this.style.radius || 3
				});
			
				pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;	
				this.graph.chartArea.children.add(pointShape);
				this.shapes.add(pointShape);
			}
			
			if(this.style.curve) {
				const startPoint = shapePoints[shapePoints.length - 1];
				if(startPoint && startPoint.y != undefined && startPoint.y != null) {
					//如果需要画曲线，则计算贝塞尔曲线坐标				
					const p1 = {x: startPoint.x + (linePoint.x - startPoint.x) / 5, y: startPoint.y};
					const p2 = {x: startPoint.x + (linePoint.x - startPoint.x) / 2, y: linePoint.y - (linePoint.y - startPoint.y) / 2};
					const p3 = {x: linePoint.x - (linePoint.x - startPoint.x) / 5, y: linePoint.y};

					//圆滑线条使用的贝塞尔对象
					this.__bezier = this.__bezier || this.graph.createShape(jmBezier);
					this.__bezier.cpoints = [
						startPoint,
						p1,
						p2,
						p3,
						linePoint
					];//设置控制点

					const bzpoints = this.__bezier.initPoints();
					shapePoints = shapePoints.concat(bzpoints);					
				}
			}									
			shapePoints.push(linePoint);
		}

		this.points = shapePoints;
		this.createArea(shapePoints);// 仓建区域效果
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend	 
	 */
	createLegend() {
		
		//生成图例前的图标
		var style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		var shape = this.graph.createShape('path',{style:style});
		
		if(this.curve || this.style.curve) {
			var p1 = {x:0,y: this.graph.style.legend.item.shape.height};
			var p2 = {x:this.graph.style.legend.item.shape.width / 3,y:this.graph.style.legend.item.shape.height/3};
			var p3 = {x:this.graph.style.legend.item.shape.width / 3 * 2,y:this.graph.style.legend.item.shape.height/3*2};
			var p4 = {x:this.graph.style.legend.item.shape.width,y:0};	

			this.__bezier = this.__bezier || this.graph.createShape(jmBezier);
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

	// 生成布效果
	createArea(points) {
		// 有指定绘制区域效果才展示
		if(!this.style.area || points.length < 2) return;

		const start = points[0];
		const end = points[points.length - 1];

		const style = this.graph.utils.clone(this.style.area, {}, true);
		// 连框颜色如果没指定，就透明
		style.stroke = style.stroke || 'transparent';

		if(!style.fill) {
			const color = this.graph.utils.hexToRGBA(this.style.stroke);
			style.fill = `linear-gradient(50% 0 50% 100%, 
				rgba(${color.r},${color.g},${color.b}, 0) 1, 
				rgba(${color.r},${color.g},${color.b}, 0) 0.3,
				rgba(${color.r},${color.g},${color.b}, 0.1) 0.1, 
				rgba(${color.r},${color.g},${color.b}, 0.2) 0)`;
		}
		else if(typeof style.fill === 'function') {
			style.fill = style.fill.call(this, style);
		}
		const area = this.graph.createShape(jmPath, {
			points: this.graph.utils.clone(points, true),
			style,
			width: this.graph.chartArea.width,
			height: this.graph.chartArea.height
		});

		// 在点集合前后加上落地到X轴的点就可以组成一个封闭的图形area
		area.points.unshift({
			x: start.x,
			y: this.graph.chartArea.height
		});
		area.points.push({
			x: end.x,
			y: this.graph.chartArea.height
		});

		this.graph.chartArea.children.add(area);
		this.shapes.add(area);
	}
}

export {
	jmLineSeries
}
