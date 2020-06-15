import jmBezier from '../../node_modules/jmgraph/src/shapes/jmBezier.js';
import jmArc from '../../node_modules/jmgraph/src/shapes/jmArc.js';
import jmSeries from './series.js';
import jmPath from '../../node_modules/jmgraph/src/core/jmPath.js';

const PreDrawKey = Symbol('lineSeries#preDraw');

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
		this.points = this.createPoints();
		//去除多余的线条
		//当数据源线条数比现有的少时，删除多余的线条
		const len = this.points.length;

		//设定其填充颜色
		//if(!this.style.fill) this.style.fill = jmUtils.toColor(this.style.stroke,null,null,20);	
		this.style.stroke = this.style.color;
		//是否启用动画效果
		//var ani = typeof this.enableAnimate === 'undefined'? this.graph.enableAnimate: this.enableAnimate;
		this.style.item.stroke = this.style.color;
			
		// 是否显示数值点圆
		if(this.style.showItem) {
			for(var i=0; i< len;i++) {
				var p = this.points[i];
				
				//如果当前点无效，则跳致下一点
				if(typeof p.y === 'undefined'  || p.y === null) {
					//prePoint = null;						
					continue;
				}
				
				const pointShape = this.graph.createShape(jmArc,{
					style: this.style.item,
					center: p,
					radius: this.style.radius || 3
				});
				pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;	
				this.graph.chartArea.children.add(pointShape);
				this.shapes.add(pointShape);
				this.bindTooltip(pointShape, p);	
			}
		}

		this.createArea(this.points);// 仓建区域效果
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
			var bezier = this.graph.createShape(jmBezier);
			bezier.cpoints = [
				p1,p2,p3,p4
			];//设置控制点		

			shape.points = bezier.initPoints();
		}
		else {
			shape.points = [{
				x:0,y: this.graph.style.legend.item.shape.height/2
			},{
				x: this.graph.style.legend.item.shape.width,y: this.graph.style.legend.item.shape.height/2
			}];
		}
		this.graph.legend.append(this,shape);
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
				rgba(${color.r},${color.g},${color.b}, 0.1) 0.5, 
				rgba(${color.r},${color.g},${color.b}, 0.3) 0.2, 
				rgba(${color.r},${color.g},${color.b}, 0.4) 0)`;
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


/**
 * 圆滑的曲线
 *
 * @class jmSplineSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
class jmSplineSeries extends jmLineSeries {
	constructor(options) {
		super(options);

		this.curve = true;// 标记为圆滑的线
	}

	// 初始化图形
	init() {
		//生成描点位
		const points = this.createPoints();
		//去除多余的线条
		//当数据源线条数比现有的少时，删除多余的线条
		const len = points.length;

		//设定其填充颜色
		//if(!this.style.fill) this.style.fill = jmUtils.toColor(this.style.stroke,null,null,20);	
		this.style.stroke = this.style.color;		

		let bezier;//圆滑线条使用的贝塞尔对象
		//是否启用动画效果
		var ani = typeof this.enableAnimate === 'undefined'?this.graph.enableAnimate:this.enableAnimate;
		this.style.item.stroke = this.style.color;		
		let shapePoints = []; // 计算出来的曲线点集合

		for(var i=0;i<len;i++) {
			var p = points[i];
			
			//如果当前点无效，则跳致下一点
			if(typeof p.y == 'undefined'  || p.y == null) {
				//prePoint = null;						
				continue;
			}
			
			// 是否显示数值点圆
			if(this.style.showItem) {
				const pointShape = this.graph.createShape(jmArc,{
					style: this.style.item,
					center: p,
					radius: this.style.radius || 3
				});
				pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;	
				this.graph.chartArea.children.add(pointShape);
				this.shapes.add(pointShape);
				this.bindTooltip(pointShape, p);
			}

			var startPoint = shapePoints[shapePoints.length - 1];
			if(startPoint && startPoint.y != undefined && startPoint.y != null) {
				//如果需要画曲线，则计算贝塞尔曲线坐标				
				var p1 = {x: startPoint.x + (p.x - startPoint.x) / 5, y: startPoint.y};
				var p2 = {x: startPoint.x + (p.x - startPoint.x) / 2, y: p.y - (p.y - startPoint.y) / 2};
				var p3 = {x: p.x - (p.x - startPoint.x) / 5, y: p.y};
				bezier = bezier || this.graph.createShape(jmBezier);
				bezier.cpoints = [
					startPoint,p1,p2,p3,p
				];//设置控制点

				var bzpoints = bezier.initPoints();
				shapePoints = shapePoints.concat(bzpoints);					
			}									
			shapePoints.push(p);
		}	

		//如果有动画，则分批加入坐标点
		if(ani) {
			this.points = [];
			this.animate(function(sp,ps,t) {
				for(var i=0;i<t;i++) {
					var index = sp.points.length;
					if(index < ps.length) {
						this.points.push(ps[index]);	
					}
					else {
						break;
					}			
				}
				return this.points.length < ps.length;

			},50,this,shapePoints,Math.ceil(shapePoints.length / 20));
		}
		else {
			this.points = shapePoints;
		}	
	}
}

export {
	jmLineSeries,
	jmSplineSeries
}
