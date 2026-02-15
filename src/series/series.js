
import { jmPath, jmList, jmControl } from 'jmgraph';
import utils from '../common/utils.js';

const ANIMATION_DATA_THRESHOLD = 100;

/**
 * 图形基类
 *
 * @class jmSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmSeries extends jmPath {	
	constructor(options) {
		super(options);

		this.option = options;

		this.field = options.field || options.fields || '';
		this.index = options.index || 1;
		this.legendLabel = options.legendLabel || '';
		this.___animateCounter = 0;
		this._cache = new Map();

		this.xAxis = this.graph.createXAxis();
		
		this.yAxis = this.yAxis || this.graph.createYAxis({
			index: this.index,
			format: options.yLabelFormat || this.graph.option.yLabelFormat
		});
		
		this.yAxis.init({
			field: Array.isArray(this.field) ? this.field[0] : this.field,
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

	//是否启用动画效果
	get enableAnimate() {
		if(typeof this.option.enableAnimate !== 'undefined') return !!this.option.enableAnimate;
		else {
			return this.graph.enableAnimate;
		}
	}
	set enableAnimate(v) {
		this.option.enableAnimate = v;
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
	/**
	 * Y轴的基线跟最底层的高度
	 */
	baseYHeight = 0;
	/**
	 * Y轴基线的Y坐标
	 */
	baseY = 0;
	/**
	 * 当前基线Y的值，不给basey就会默认采用当前Y轴最小值
	 */
	baseYValue = 0;

	initDataPoint(...args) {
		let dataChanged = false;
		
		if(this.enableAnimate && this.data && this.data.length < ANIMATION_DATA_THRESHOLD) {
			this.lastPoints = this.graph.utils.clone(this.dataPoints, null, true, (obj) => {
				if(obj instanceof jmControl) return obj;
			});

			this.dataPoints = this.createPoints(...args);
			dataChanged = utils.arrayIsChange(this.lastPoints, this.dataPoints, (s, t) => {
				return s.x === t.x && s.y === t.y;
			});

			if(dataChanged) {
				this.___animateCounter = 0;
			}
		} else {
			this.dataPoints = this.createPoints(...args);
		}
		
		if(this.option && this.option.onInit) {
			this.option.onInit.apply(this, args);
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

		
	reset() {
		var shape;
		while(shape = this.shapes.shift()) {
			shape && shape.remove();
		}

		this.initAxisValue();
		this.createLegend();

		return this.chartInfo = {
			xAxis: this.xAxis,
			yAxis: this.yAxis
		};
	}

	initAxisValue() {
		if(!this.data || !this.data.length) return;
		
		for(var i = 0; i < this.data.length; i++) {	
			if(Array.isArray(this.field)) {
				this.field.forEach((f) => {
					const v = this.data[i][f]; 
					if(v != null) {
						this.yAxis.max(v);
						this.yAxis.min(v);
					}
				});
			} else {
				const v = this.data[i][this.field]; 
				if(v != null) {
					this.yAxis.max(v);
					this.yAxis.min(v);
				}
			}

			const xv = this.data[i][this.xAxis.field]; 
			if(xv != null) {
				this.xAxis.max(xv);
				this.xAxis.min(xv);
			}
		}
	}

	createPoints(data) {
		data = data || this.data;		
		if(!data || !data.length) return [];

		const xstep = this.xAxis.step();
		const minY = this.yAxis.min();
		const ystep = this.yAxis.step();

		this.baseYValue = typeof this.graph.baseY === 'undefined' ? minY : (this.graph.baseY || 0);
		this.baseYHeight = (this.baseYValue - minY) * ystep;
		this.baseY = this.graph.chartArea.height - this.baseYHeight;
		
		const fields = Array.isArray(this.field) ? this.field : [this.field];
		const dataPoints = [];
		
		for(let i = 0; i < data.length; i++) {
			const s = data[i];
			const xv = s[this.xAxis.field];		

			const p = {				
				data: s,
				index: i,
				xValue: xv,
				xLabel: xv,
				points: [],
				style: this.graph.utils.clone(this.style),
			};
			
			p.x = xstep * i + this.xAxis.labelStart;			
			
			for(let j = 0; j < fields.length; j++) {
				const f = fields[j];
				const yv = s[f];
				p.yLabel = p.yValue = yv;
				p.height = (yv - this.baseYValue) * ystep;

				const point = {
					x: p.x,
					height: p.height,
					yValue: yv,
					field: f				
				}
				
				if(yv == null || typeof yv == 'undefined') {
					point.m = p.m = true;
				} else {
					if(this.yAxis.dataType != 'number') {
						yv = i;
					}
					point.y = p.y = this.baseY - point.height;
				}	
				p.points.push(point);
			}

			if(typeof this.option.initItemHandler === 'function') {
				this.option.initItem.call(this, p);
			}
				
			dataPoints.push(p);													
		}
		
		this.dataPoints = dataPoints;
		return this.dataPoints;
	}

	// 生成颜色
	getColor(p) {
		if(typeof this.style.color === 'function') {
			return this.style.color.call(this, p);
		}
		else {
			return this.style.color;
		}
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend
	 */
	createLegend() {
		//生成图例前的图标
		const style = this.graph.utils.clone(this.style);
		style.fill = this.getColor();	
		//delete style.stroke;
		const shape = this.graph.createShape('rect',{
			style
		});
		this.graph.legend.append(this, shape);
		return shape;
	}

	// 生成柱图的标注
	createItemLabel(point, position) {
		if(!this.style.label || this.style.label.show !== true) return;
		
		const text = this.option.itemLabelFormat?this.option.itemLabelFormat.call(this, point): point.yValue;
		if(!text) return;
		
		// v如果指定了为控件，则直接加入
		if(text instanceof jmControl) {
			this.addShape(text);
			return text;
		}
		
		const style = this.graph.utils.clone(this.graph.style.itemLabel, {
			zIndex: 21,
			...this.style.label
		});

		if(typeof style.fill === 'function') {
			style.fill = style.fill.call(this, point);
		}
		
		const barWidth = (this.barTotalWidth||0) / 2 - (this.barWidth||0) * (this.barIndex||0) - (this.barWidth||0) / 2;
		const baseOffset = point.y - this.baseY;
		const label = this.graph.createShape('label', {
			style,
			text: text,
			data: point,
			position: function() {
				const offh = style.offset || 5;
				const size = this.testSize();
				return {
					x: point.x - size.width / 2 - barWidth,
					y: baseOffset>0?(point.y + offh): (point.y - size.height - offh)
				}
			}
		});

		this.addShape(label);
	}

	/**
	 * 在图上加下定制图形
	 * @param {jmShape} shape  图形
	 */
	addShape(shape) {
		this.graph.chartArea.children.add(shape);
		this.shapes.add(shape);
		return shape;
	}

	/**
	 * 获取指定事件的集合
	 * 比如mousedown,mouseup等
	 *
	 * @method getEvent
	 * @param {string} name 事件名称
	 * @return {list} 事件委托的集合
	 */
	getEvent(name) {	
			
		const event = this.option? this.option[name]: null;
		if(!event) {
			return super.getEvent(name);
		}
		else {
			const events = new jmList();
			events.add(event);

			const oldevents = super.getEvent(name);
			if(oldevents) {
				events.concat(oldevents);
			}
			return events;
		}
	}
};
