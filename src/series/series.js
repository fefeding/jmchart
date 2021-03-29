
import { jmPath, jmList, jmControl } from 'jmgraph/src/core/jmGraph.js';
import jmRect from 'jmgraph/src/shapes/jmRect.js';
import jmCircle from 'jmgraph/src/shapes/jmCircle.js';
import jmLabel from 'jmgraph/src/shapes/jmLabel.js';
import utils from '../common/utils.js';

/**
 * 图形基类
 *
 * @class jmSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

//构造线图
export default class jmSeries extends jmPath {	
	constructor(options) {
		super(options);

		this.options = options;

		this.field = options.field || '';
		this.index = options.index || 1;
		this.legendLabel = options.legendLabel || '';
		this.___animateCounter = 0; // 动画计数

		this.xAxis = this.graph.createXAxis(); // 生成X轴
		
		// 生成当前Y轴
		this.yAxis = this.yAxis || this.graph.createYAxis({
			index: this.index,
			format: options.yLabelFormat || this.graph.options.yLabelFormat
		});
		
		// 初始化一些参数， 因为这里有多个Y轴的可能，所以每次都需要重调一次init
		this.yAxis.init({
			field: this.field,
			minYValue: options.minYValue,
			maxYValue: options.maxYValue
		});
	}

	/**
	 * 关联访问的是chart的数据源
	 */
	get data() {
		return this.graph.data;
	}
	set data(d) {
		this.graph.data = d;
	}

	/**
	 * 图例名称
	 *
	 * @property legendLabel
	 * @type string
	 */
	legendLabel = '';

	/**
	 * 当前图形下的所有子图
	 */
	shapes = new jmList();

	/**
	 * 关健点集合
	 */
	keyPoints = [];

	/**
	 * 标注集合
	 */
	labels = [];

	// 图绑定的属性名
	field = '';

	// 做一些基础初始化工作
	init(...args) {
		//生成描点位
		// 如果有动画，则需要判断是否改变，不然不需要重新动画
		let dataChanged = false;
		if(this.enableAnimate) {
			// 拷贝一份上次的点集合，用于判断数据是否改变
			this.lastPoints = this.graph.utils.clone(this.dataPoints, null, true, (obj) => {
				if(obj instanceof jmControl) return obj;
			});

			// 重新生成描点
			this.dataPoints = this.createPoints(...args);

			dataChanged = utils.arrayIsChange(this.lastPoints, this.dataPoints, (s, t) => {
				return s.x === t.x && s.y === t.y;
			});

			if(dataChanged) this.___animateCounter = 0;// 数据改变。动画重新开始
		}	
		else {
			this.dataPoints = this.createPoints(...args);
		}
		return {
			dataChanged,
			points: this.dataPoints
		};
	}

	/**
	 * 根据X轴坐标，获取它最近的数据描点
	 * 离点最近的一个描点
	 * @param {number} x  X轴坐标
	 */
	getDataPointByX(x) {
		if(!this.dataPoints) return null;
		// 获取最近的那个
		let prePoint = undefined, nextPoint = undefined; // 跟上一个点和下一个点的距离，哪个近用哪个
		for(let i=0; i< this.dataPoints.length; i++) {
			const p = this.dataPoints[i];
			if(p.x == x) return p;

			// 上一个点
			if(p.x < x) {
				if(i === this.dataPoints.length - 1) return p;
				prePoint = p;
			}

			// 下一个点
			if(typeof nextPoint === 'undefined' && p.x > x) {
				// 没有上一个，只能返回这个了
				if(prePoint && x - prePoint.x < p.x - x) return prePoint;
				else return p
			}
		}
		return null;
	}

	/**
	 * 根据X轴值获取数据点
	 * @param {number} xValue  X轴值
	 */
	getDataPointByXValue(xValue) {
		if(!this.dataPoints) return null;
		
		for(let i=0; i< this.dataPoints.length; i++) {
			const p = this.dataPoints[i];
			if(p.xValue == xValue) return p;
		}
		return null;
	}

		
	/**
	 * 重置属性
	 * 根据数据源计算轴的属性
	 *
	 * @method reset
	 */
	reset() {	
		//是否启用动画效果
		this.enableAnimate = typeof this.enableAnimate === 'undefined'?this.graph.enableAnimate:this.enableAnimate;

		// 重置所有图形
		var shape;
		while(shape = this.shapes.shift()) {
			shape && shape.remove();
		}
		
		//生成图例  这里要放到shape清理后面
		this.createLegend();

		// 计算最大最小值
		// 当前需要先更新axis的边界值，轴好画图
		for(var i=0; i< this.data.length;i++) {	
			const v = this.data[i][this.field]; 
			this.yAxis.max(v);
			this.yAxis.min(v);

			const xv = this.data[i][this.xAxis.field]; 
			this.xAxis.max(xv);
			this.xAxis.min(xv);
		}

		return this.chartInfo = {
			xAxis: this.xAxis,
			yAxis: this.yAxis
		};
	}

	/**
	 * 生成序列图描点
	 *
	 * @method createPoints
	 */
	createPoints(data) {
		data = data || this.data;		
		if(!data) return;

		const xstep = this.xAxis.step();
		const ystep = this.yAxis.step();	

		this.dataPoints = [];
		for(let i=0;i < data.length; i++) {
			const s = data[i];
			
			const xv = s[this.xAxis.field];
			const yv = s[this.field];

			const p = {				
				data: s,
				xValue: xv,
				xLabel: xv,
				yValue: yv,
				yLabel: yv
			};
			
			// 这里的点应相对于chartArea
			p.x = xstep * (data.length === 1? 1: i) + this.xAxis.labelStart;			

			//如果Y值不存在。则此点无效，不画图
			if(yv == null || typeof yv == 'undefined') {
				p.m = true;
			}
			else {
				if(this.yAxis.dataType != 'number') {
					yv = i;
				}
				p.y = this.graph.chartArea.height - (yv - this.yAxis.min()) * ystep;
			}			
			this.dataPoints.push(p);							
		}
		return this.dataPoints;
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend
	 */
	createLegend() {
		//生成图例前的图标
		const style = this.graph.utils.clone(this.style);
		style.fill = style.color;	
		//delete style.stroke;
		const shape = this.graph.createShape(jmRect,{
			style
		});
		this.graph.legend.append(this, shape);
	}

	/**
	 * 添加关健点
	 * @param {object} options 关健点的参数，
	 * {
	 * xValue 对应的X轴值
	 * 	radius: 大小,
	 * style: {
	 * stroke: 边颜色
	 * fill: 填充色
	 * }
	 * }
	 */
	addKeyPoint(options) {
		if(!options) return;
		this.keyPoints.push(options);
		return options;
	}

	/**
	 * 添加标注
	 * @param {object} options 参数，
	 * {
	 * xValue 对应的X轴值
	 * text 显示文案
	 * width: 宽,
	 * height: 高
	 * 可以参考jmLabel样式
	 * style: {
	 * stroke: 边颜色
	 * fill: 填充色
	 * font: 字体
	 * }
	 * }
	 */
	addLabel(options) {
		if(!options) return;
		this.labels.push(options);
		return options;
	}

	// 在关健点生成高亮点
	createKeyPoint(point) {
		for(const opt of this.keyPoints) {
			if(opt.xValue !== point.xValue) return;

			const pointShape = this.graph.createShape(jmCircle, {
				style: Object.assign({
					stroke: this.style.stroke,
					fill: this.style.stroke
				}, opt.style||{}),
				center: point,
				radius: opt.radius || 5
			});
		
			pointShape.zIndex = 20;	
			this.graph.chartArea.children.add(pointShape);
			this.shapes.add(pointShape);
		}
	}

	// 在关健点生成标注
	createLabel(point) {
		for(const opt of this.labels) {
			if(opt.xValue !== point.xValue || !opt.text) return;

			const label = this.graph.createShape(jmLabel, {
				style: Object.assign({
					stroke: this.style.stroke,
					fill: this.style.stroke,
					textAlign: 'center',
					textBaseline: 'middle',
					border: {
						top: true,
						left: true,
						right: true,
						bottom: true,
						style: {
							fill: '#000'
						}
					}
				}, opt.style||{}),
				text: opt.text,
				position: point
			});

			const size = label.testSize();
			label.position.y -= (size.height + 10);
			label.position.x -= size.width / 2;
		
			label.zIndex = 20;	
			this.graph.chartArea.children.add(label);
			this.shapes.add(label);
		}
	}
};
