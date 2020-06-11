import jmBezier from '../../node_modules/jmgraph/src/shapes/jmBezier.js';
import jmArc from '../../node_modules/jmgraph/src/shapes/jmArc.js';
import jmSeries from './series.js';

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
	}

	/**
	 * 绘制当前图形
	 *
	 * @method draw
	 * @for jmLineSeries
	 */
	beginDraw() {
		super.beginDraw();
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
				
		for(var i=0;i<len;i++) {
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
	}
}

/**
 * 绘制当前图形
 *
 * @method draw
 * @for jmSplineSeries
 */
jmSplineSeries.prototype.draw = function() {			
	var chartinfo = this.chartInfo || this.reset();	
	var source = this.source || this.graph.source;		
	if(source) {
		//生成描点位
		this.createPoints(source);
		//去除多余的线条
		//当数据源线条数比现有的少时，删除多余的线条
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
		//if(!this.style.fill) this.style.fill = jmUtils.toColor(this.style.stroke,null,null,20);	
		this.style.stroke = this.style.color;		

		var bezier;//圆滑线条使用的贝塞尔对象
		//是否启用动画效果
		var ani = typeof this.enableAnimate === 'undefined'?this.graph.enableAnimate:this.enableAnimate;
		this.style.item.stroke = this.style.color;
		//var prePoint;
		var shape = this.shapes.get(0);
		if(!shape) {
			shape = this.shapes.add(this.graph.createPath(null,this.style))
			this.graph.chartArea.children.add(shape);
		}
		var shapePoints = [];
		
		for(var i=0;i<len;i++) {
			var p = this.points[i];
			
			//如果当前点无效，则跳致下一点
			if(typeof p.y == 'undefined'  || p.y == null) {
				//prePoint = null;						
				continue;
			}
			
			var pointShape = this.graph.graph.createShape(jmArc,{
				style: this.style.item,
				center: p,
				radius: this.style.radius || 3
			});
			pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;	
			this.graph.chartArea.children.add(pointShape);
			this.shapes.add(pointShape);
			this.bindTooltip(pointShape,p);

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
			shape.points = [];
			shape.animate(function(sp,ps,t) {
				for(var i=0;i<t;i++) {
					var index = sp.points.length;
					if(index < ps.length) {
						sp.points.push(ps[index]);	
					}
					else {
						break;
					}			
				}
				return sp.points.length < ps.length;

			},50,shape,shapePoints,Math.ceil(shapePoints.length / 20));
		}
		else {
			shape.points = shapePoints;
		}	
	}
}

export {
	jmLineSeries,
	jmSplineSeries
}
