import jmRect from 'jmgraph/src/shapes/jmRect.js';
import jmArc from 'jmgraph/src/shapes/jmArc.js';
import jmHArc from 'jmgraph/src/shapes/jmHArc.js';
import jmLabel from 'jmgraph/src/shapes/jmLabel.js';
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

		this.xAxis.visible = false;
		this.yAxis.visible = false;
	}

	// 重新初始化图形
	init() {
	
		//总和
		this.totalValue = 0;
		//计算最大值和最小值
		if(this.data) {		
			for(const i in this.data) {
				const s = this.data[i];							
				const vy = s[this.field];	
				if(vy) {
					this.totalValue += Math.abs(vy);
				}	
			}		
		}

		const center = { 
			x: this.graph.chartArea.width / 2, 
			y: this.graph.chartArea.height / 2
		};
		
		const radius = Math.min(center.x - this.style.margin.left - 
			this.style.margin.right * this.graph.devicePixelRatio,
			center.y - this.style.margin.top * this.graph.devicePixelRatio - this.style.margin.bottom * this.graph.devicePixelRatio);
		

		//生成描点位
		// super.init会把参数透传给 createPoints
		const { points, dataChanged }  = super.init(center, radius);	

		// 是否正在动画中
		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0 );

		// 在动画中，则一直刷新
		if(isRunningAni) {
			const aniCount = (this.style.aniCount || 20);
			let aniIsEnd = true;// 当次是否结束动画
			const len = points.length;
			for(let i=0; i<len; i++) {				

				const p = points[i];
				const step = (p.y - p.shape.startAngle) / aniCount;

				p.shape.endAngle = p.shape.startAngle + this.___animateCounter * step;

				if(p.shape.endAngle >= p.y) {
					p.shape.endAngle = p.y;
				}
				else {
					aniIsEnd = false;
				}
				// p.shape.points = arc.initPoints();
				// p.shape.points.push(center);			
				//绑定提示框
				//this.bindTooltip(p.shape, p);
			}
			// 所有动画都完成，则清空计数器
			if(aniIsEnd) {
				this.___animateCounter = 0;
			}
			else {
				this.___animateCounter ++;
				// next tick 再次刷新
				setTimeout(()=>{
					this.needUpdate = true;//需要刷新
				});
			}
		}
	}

	/**
	 * 生成序列图描点
	 *
	 * @method createPoints
	 */
	createPoints(center, radius) {		
		if(!this.data) return [];

		const points = [];
		let index = 0;
		
		let startAni = 0; // 总起始角度
		let cm = Math.PI * 2;
		//规定应该逆时针还是顺时针绘图 false  顺时针，true 逆时针
		const anticlockwise = this.options.anticlockwise || false;
		// 每项之间的间隔角度  顺时钟为正，否则为负
		const marginAngle = (Number(this.style.marginAngle) || 0);

		for(var i=0;i< this.data.length;i++) {
			const s = this.data[i];
			
			const yv = s[this.field];

			//如果Y值不存在。则此点无效，不画图
			if(yv == null || typeof yv == 'undefined') {
				continue;
			}
			else {
				const p = {				
					data: s,
					x: i,
					yValue: yv,
					yLabel: yv,
					step: Math.abs(yv / this.totalValue),// 每个数值点比
					style: this.graph.utils.clone(this.style),
					anticlockwise
				};
				//p.style.color = this.graph.getColor(index);
				if(p.style.color && typeof p.style.color === 'function') {
					p.style.fill = p.style.color.call(this, p);
				}
				else {
					p.style.fill = this.graph.getColor(index);
				}

				const start = startAni;// 上一个扇形的结束角度为当前的起始角度
				// 计算当前结束角度, 同时也是下一个的起始角度
				p.y = startAni + p.step * cm;
				startAni = p.y;
				p.startAngle = start + marginAngle;
				p.endAngle = p.y;

				if(center && radius) {
					const arcWidth = this.style.arcWidth || radius*0.2;
					let curRadius = radius;
					// 如果有指定动态半径，则调用
					if(typeof this.options.radius === 'function') {
						curRadius = this.options.radius.call(this, p, radius, i);
					}
					let maxRadius = curRadius;
					// 如果有指定动态半径，则调用
					if(typeof this.options.maxRadius === 'function') {
						maxRadius = this.options.maxRadius.call(this, p, maxRadius, i);
					}
					let minRadius = curRadius - arcWidth;
					// 如果有指定动态半径，则调用
					if(typeof this.options.minRadius === 'function') {
						minRadius = this.options.minRadius.call(this, p, minRadius, i);
					}
					let curCenter = center;
					// 如果有指定动态半径，则调用
					if(typeof this.options.center === 'function') {
						curCenter = this.options.center.call(this, p, curCenter, i);
					}
					p.shape = this.graph.createShape(this.style.isHollow? jmHArc : jmArc, {
						style: p.style,
						startAngle: p.startAngle,
						endAngle: p.endAngle,
						anticlockwise: anticlockwise,
						isFan: true, // 表示画扇形
						center: curCenter,
						radius: curRadius,
						maxRadius,
						minRadius
					});

					/**
					 * 因为jmgraph是按图形形状来计算所占区域和大小的， 这里我们把扇形占区域改为整个图圆。这样计算大小和渐变时才好闭合。
					 */
					p.shape.getLocation = function() {			
						const local = this.location = {
							left: 0,
							top: 0,
							width: 0,
							height: 0,
							center: this.center,
							radius: curRadius
						};

						local.left = this.center.x - curRadius;
						local.top = this.center.y - curRadius;
						local.width = local.height = curRadius * 2;
						
						return local;
					}
					p.shape.getBounds = function() {
						return this.getLocation();
					}

					this.shapes.add(p.shape);
					this.graph.chartArea.children.add(p.shape);

					// 如果有点击事件
					if(this.options.onClick) {
						p.shape.on('click', (e) => {
							this.options.onClick.call(this, p, e);
						});
					}
					if(this.options.onOver) {
						p.shape.on('mouseover touchover', (e) => {
							this.options.onOver.call(this, p, e);
						});
					}
					if(this.options.onLeave) {
						p.shape.on('mouseleave touchleave', (e) => {
							this.options.onLeave.call(this, p, e);
						});
					}

					this.createLabel(p);// 生成标签
				}
				points.push(p);
				index++;				
			}			
		}
		
		return points;
	}

	// 生成柱图的标注
	createLabel(point) {
		if(this.style.label && this.style.label.show === false) return;

		const text = this.options.labelFormat?this.options.labelFormat(point): point.step;

		const self = this;
		
		const label = this.graph.createShape(jmLabel, {
			style: this.style.label,
			text: text,
			position: function() {
				if(!this.parent || !this.parent.points || !this.parent.points.length) return {x: 0, y: 0};

				// 动态计算位置
				const parentRect = this.parent.getBounds();
				//const rect = this.getBounds.call(this.parent);

				// 圆弧的中间位，离圆心最近和最完的二个点
				let centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length / 2)];
				let centerMinPoint = this.parent.center;
				// 如果是空心圆，则要计算 1/4 和 3/4位的点。顺时针和逆时针二个点大小不一样，这里只取，大小计算时处理
				if(self.style.isHollow) {
					centerMaxPoint = this.parent.points[Math.floor(this.parent.points.length * 0.25)];
					centerMinPoint = this.parent.points[Math.floor(this.parent.points.length * 0.75)];
				}
				const centerMinX = Math.min(centerMaxPoint.x, centerMinPoint.x);
				const centerMaxX = Math.max(centerMaxPoint.x, centerMinPoint.x);
				const centerMinY = Math.min(centerMaxPoint.y, centerMinPoint.y);
				const centerMaxY = Math.max(centerMaxPoint.y, centerMinPoint.y);

				// 中心点
				const center = {
					x: (centerMaxX - centerMinX) / 2 + centerMinX,
					y: (centerMaxY - centerMinY) / 2 + centerMinY,
				};

				const size = this.testSize();

				// 取图形中间的二个点
				// rect是相对于图形坐标点形图的图形的左上角，而parentRect是图形重新指定的整圆区域。减去整圆区域左上角就是相对于整圆区域坐标
				return {
					x: center.x - parentRect.left - size.width / 2,
					y: center.y - parentRect.top - size.height / 2
				}
			}
		});

		point.shape.children.add(label);
	}
}



/**
 * 生成图例
 *
 * @method createLegend	 
 */
jmPieSeries.prototype.createLegend = function() {
	
	const points = this.createPoints();
	if(!points || !points.length) return;
	
	for(let k in points) {
		const p = points[k];
		if(!p) continue;

		//生成图例前的图标
		const style = this.graph.utils.clone(p.style);
		style.fill = style.fill;	
		//delete style.stroke;
		const shape = this.graph.createShape(jmRect,{
			style: style,
			position : {x: 0, y: 0}
		});
		//shape.targetShape = p.shape;
		//此处重写图例事件
		this.graph.legend.append(this, shape, {
			name: this.legendLabel, 
			hover: function() {	
				//var sp = this.children.get(0);
				//应用图的动态样式
				Object.assign(this.targetShape.style, this.targetShape.style.hover);	
				Object.assign(this.style, this.style.hover);
			},
			leave: function() {	
				//var sp = this.children.get(0);
				//应用图的普通样式
				Object.assign(this.targetShape.style, this.targetShape.style.normal);			
				Object.assign(this.style, this.style.normal);
			}, 
			data: this.data[k]
		});
	}	
}

