import jmRect from '../../node_modules/jmgraph/src/shapes/jmRect.js';
import jmArc from '../../node_modules/jmgraph/src/shapes/jmArc.js';
import jmSeries from './series.js';

/**
 * 饼图
 *
 * @class jmPieSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造函数
export default class jmPieSeries extends jmSeries {
	constructor(options) {
		super(options);
	}
}

/**
 * 重置属性
 * 根据数据源计算轴的属性
 *
 * @method reset
 * @return {object} 当前图形信息
 */
jmPieSeries.prototype.reset = function() {	
	var ymapping;
	this.mappings.each(function(i,m) {
		if(m.type == 'y') {
			ymapping = m;
			return false;//如果都已确定则退出循 环
		}
	});	
	
	var source = this.source || this.graph.source;
	//总和
	var totalValue = 0;
	//计算最大值和最小值
	if(source && ymapping) {		
		for(var i in source) {
			var s = source[i];							
			var vy = s[ymapping.field];	
			if(vy) {
				totalValue += Math.abs(vy);
			}	
		}		
	}
	var center = {x:0,y:0};
	center.x = this.graph.chartArea.width / 2;
	center.y = this.graph.chartArea.height / 2;
	
	this.chartInfo = {yMapping:ymapping,center:center,totalValue:totalValue};
	//生成描点位
	this.createPoints(source);

	return this.chartInfo;
}

/**
 * 生成图例
 *
 * @method createLegend	 
 */
jmPieSeries.prototype.createLegend = function() {
	for(var k in this.points) {
		var p = this.points[k];
		//生成图例前的图标
		var style = this.graph.utils.clone(p.style);
		style.fill = style.color;	
		//delete style.stroke;
		var shape = this.graph.createShape(jmRect,{style:style});
		//shape.targetShape = p.shape;
		//此处重写图例事件
		var name = this.decodeInfo(this.legendLabel,p);
		this.graph.legend.append(this,shape,name,function() {	
			var sp = this.children.get(0);
			//应用图的动态样式
			Object.assign(this.targetShape.style, this.targetShape.style.hover);	
			Object.assign(this.style, this.style.hover);
		},function() {	
			var sp = this.children.get(0);
			//应用图的普通样式
			Object.assign(this.targetShape.style, this.targetShape.style.normal);			
			Object.assign(this.style, this.style.normal);
		}, p.shape);
	}	
}

/**
 * 生成序列图描点
 *
 * @method createPoints
 */
jmPieSeries.prototype.createPoints = function(source) {
	source = source || this.source || this.graph.source;		
	if(!source) return;

	var shapecount = this.shapes.count();
	//清除所有现有的图形			
	for(var i=shapecount-1;i>=0;i--) {
		var shape = this.shapes.get(i);
		this.shapes.removeAt(i);
		if(shape) {
			shape.remove();
		}
	}
	var chartinfo = this.chartInfo;

	this.points = [];
	var index = 0;
	
	for(var i=0;i<source.length;i++) {
		var s = source[i];
		
		var yv = s[chartinfo.yMapping.field];

		//如果Y值不存在。则此点无效，不画图
		if(yv == null || typeof yv == 'undefined') {
			continue;
		}
		else {
			var p = {				
				source: s,
				yValue: yv,
				yLabel: yv,
				style: this.graph.utils.clone(this.style)
			};
			p.style.stroke = p.style.color = this.graph.getColor(index);
			p.style.fill = p.style.color;
			//计算占比
			p.per = Math.abs(p.yValue / chartinfo.totalValue);
			
			p.shape = this.graph.createPath([],p.style);
			this.shapes.add(p.shape);
			this.graph.chartArea.children.add(p.shape);

			this.points.push(p);
			index++;				
		}			
	}
	//生成图例
	this.createLegend();
}

/**
 * 绘制当前图形
 *
 * @method draw
 * @for jmBarSeries
 */
jmPieSeries.prototype.draw = function() {			
	//var chartinfo = this.chartInfo || this.reset();		
	//是否启用动画效果
	var ani = typeof this.enableAnimate === 'undefined'?this.graph.enableAnimate:this.enableAnimate;
	
	var startAni = 0;
	var cm = Math.PI * 2;
	var center = this.chartInfo.center;
	center.x = this.graph.chartArea.width / 2;
	center.y = this.graph.chartArea.height / 2;
	
	var radius = Math.min(center.x - this.style.margin.left - 
		this.style.margin.right,center.y - this.style.margin.top - this.style.margin.bottom);
	var arc = this.graph.createShape(jmArc,{center:center,radius:radius,anticlockwise:true});
	
	if(ani) {
		var endAni = this.points[0].per * cm;
		function animate(points,start,endAni,cm,arc,index,series) {
			var p = points[index];
			var end = arc.endAngle() || start;
			end += 0.3;
			
			//完成一个，接替到下一个
			if(end > endAni) {
				end = endAni;				
			}

			//刷新角度
			arc.startAngle(start);
			arc.endAngle(end);
			//初始化扇形
			p.shape.points = arc.initPoints();
			p.shape.points.push(center);
			//终止当前动画
			if(end == endAni) {
				index ++;
				if(index < points.length) {					
					var nextpoint = points[index];
					if(nextpoint) {
						endAni = end + nextpoint.per * cm;
						//继续下一个动画
						nextpoint.shape.animate(animate,50,points,end,endAni,cm,arc,index,series);
					}
					else {
						console.log('point null');
					}
				}
				//绑定提示框
				series.bindTooltip(p.shape,p);
				return false;
			}
		}
		this.graph.animate(animate,50,this.points,startAni,endAni,cm,arc,0,this);
	}
	else {
		var len = this.points.length;
		for(var i=0;i<len;i++) {
			var p = this.points[i];		
			var start = startAni;
			startAni += p.per * cm;
			arc.startAngle(start);
			arc.endAngle(startAni);

			p.shape.points = arc.initPoints();
			p.shape.points.push(center);			
			//绑定提示框
			this.bindTooltip(p.shape,p);
		}
	}	
}
