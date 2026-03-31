import { jmPath, jmList, jmControl } from 'jmgraph';
import utils from '../common/utils.js';

// 公共常量提取到基类，避免每个子类重复定义
export const ANIMATION_DATA_THRESHOLD = 100;
export const DEFAULT_ANIMATION_COUNT = 10;

/**
 * 图表系列基类
 * 
 * 所有图表类型的基类，提供通用的数据点生成、坐标轴管理、动画控制和图例生成功能。
 * 子类需要实现 init() 方法来定义具体的图表绘制逻辑。
 *
 * @class jmSeries
 * @module jmChart
 * @extends jmPath
 * 
 * @example
 * // 创建自定义图表系列
 * class MySeries extends jmSeries {
 *   init() {
 *     const { points } = this.initDataPoint();
 *     // 绘制图形...
 *   }
 * }
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
		this.xAxis.init({
			field: options.xField
		});
		
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
	 * @type {Array}
	 */
	get data() {
		return this.graph.data;
	}
	set data(d) {
		this.graph.data = d;
	}

	/**
	 * 是否启用动画效果
	 * @type {boolean}
	 */
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
	 * @type {string}
	 */
	legendLabel = '';

	/**
	 * 当前图形下的所有子图形状
	 * @type {jmList}
	 */
	shapes = new jmList();

	/**
	 * 关键点集合，用于交互和提示
	 * @type {Array}
	 */
	keyPoints = [];

	/**
	 * 标注集合
	 * @type {Array}
	 */
	labels = [];

	/**
	 * 图表绑定的数据字段名
	 * @type {string|string[]}
	 */
	field = '';

	/**
	 * Y轴的基线跟最底层的高度
	 * @type {number}
	 */
	baseYHeight = 0;

	/**
	 * Y轴基线的Y坐标
	 * @type {number}
	 */
	baseY = 0;

	/**
	 * 当前基线Y的值，不给basey就会默认采用当前Y轴最小值
	 * @type {number}
	 */
	baseYValue = 0;

	/**
	 * 初始化数据点
	 * 
	 * 根据数据生成图表的数据点，支持动画效果。
	 * 当数据量小于阈值(100)且启用动画时，会记录上一次的数据点用于动画过渡。
	 *
	 * @param {...any} args 传递给 createPoints 的参数
	 * @returns {Object} 包含 points 和 dataChanged 的对象
	 */
	initDataPoint(...args) {
		let dataChanged = false;
		
		if(this.enableAnimate && this.data && this.data.length < ANIMATION_DATA_THRESHOLD) {
			// 仅在数据引用变化时才做深度比较
			if(this._lastData !== this.data) {
				this.lastPoints = this.graph.utils.clone(this.dataPoints, null, true, (obj) => {
					if(obj instanceof jmControl) return obj;
				});

				this.dataPoints = this.createPoints(...args);
				dataChanged = utils.arrayIsChange(this.lastPoints, this.dataPoints, (s, t) => {
					return s.x === t.x && s.y === t.y;
				});
				this._lastData = this.data;
			}
			else {
				this.dataPoints = this.createPoints(...args);
			}

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
	 * 根据X轴坐标获取最近的数据描点
	 * 
	 * @param {number} x X轴坐标
	 * @returns {Object|null} 最近的数据点对象
	 */
	getDataPointByX(x) {
		if(!this.dataPoints) return null;

		let prePoint = undefined, nextPoint = undefined;
		for(let i=0; i< this.dataPoints.length; i++) {
			const p = this.dataPoints[i];
			if(p.x == x) return p;

			if(p.x < x) {
				if(i === this.dataPoints.length - 1) return p;
				prePoint = p;
			}

			if(typeof nextPoint === 'undefined' && p.x > x) {
				if(prePoint && x - prePoint.x < p.x - x) return prePoint;
				else return p
			}
		}
		return null;
	}

	/**
	 * 根据X轴值获取数据点
	 * 
	 * @param {any} xValue X轴值
	 * @returns {Object|null} 数据点对象
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
	 * 重置图表系列
	 * 
	 * 清除所有形状，重新初始化坐标轴和图例
	 * 
	 * @returns {Object} 包含 xAxis 和 yAxis 的信息对象
	 */
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

	/**
	 * 初始化坐标轴的值范围
	 * 
	 * 遍历数据，计算X轴和Y轴的最大最小值
	 */
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

	/**
	 * 创建数据点
	 * 
	 * 根据数据源和坐标轴配置，计算每个数据点的屏幕坐标位置
	 * 
	 * @param {Array} data 数据源，默认使用 this.data
	 * @returns {Array} 数据点数组
	 */
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
				style: this.style, // 共享引用，避免深拷贝；子类如需修改应自行创建副本
			};
			
			p.x = xstep * i + this.xAxis.labelStart;			
			
			for(let j = 0; j < fields.length; j++) {
				const f = fields[j];
				let yv = s[f];
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

	/**
	 * 生成颜色
	 * 
	 * @param {Object} p 数据点对象
	 * @returns {string} 颜色值
	 */
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
	 * @returns {jmShape} 图例形状
	 */
	createLegend() {
		const style = this.graph.utils.clone(this.style);
		style.fill = this.getColor();	
		const shape = this.graph.createShape('rect',{
			style
		});
		this.graph.legend.append(this, shape);
		return shape;
	}

	/**
	 * 生成数据项标签
	 * 
	 * 在数据点上方或指定位置显示数值标签
	 * 
	 * @param {Object} point 数据点对象
	 * @param {string} position 标签位置 (top/bottom/left/right/inside)
	 */
	createItemLabel(point, position) {
		if(!this.style.label || this.style.label.show !== true) return;
		
		const text = this.option.itemLabelFormat?this.option.itemLabelFormat.call(this, point): point.yValue;
		if(!text) return;
		
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
				const position = style.position || (baseOffset > 0 ? 'top' : 'bottom');

				switch(position) {
					case 'top':
						return {
							x: point.x - size.width / 2 - barWidth,
							y: point.y - size.height - offh
						};
				case 'bottom':
						return {
							x: point.x - size.width / 2 - barWidth,
							y: point.y + offh
						};
				case 'left':
						return {
							x: point.x - size.width - offh - barWidth,
							y: point.y - size.height / 2
						};
				case 'right':
						return {
							x: point.x + offh - barWidth,
							y: point.y - size.height / 2
						};
				case 'inside':
						return {
							x: point.x - size.width / 2 - barWidth,
							y: point.y + (baseOffset > 0 ? -size.height / 2 : size.height / 2)
						};
				default:
						return {
							x: point.x - size.width / 2 - barWidth,
							y: baseOffset>0?(point.y - size.height - offh): (point.y + offh)
						};
				}
			}
		});

		this.addShape(label);
	}

	/**
	 * 在图表上添加形状
	 * 
	 * @param {jmShape} shape 图形对象
	 * @returns {jmShape} 添加的图形对象
	 */
	addShape(shape) {
		this.graph.chartArea.children.add(shape);
		this.shapes.add(shape);
		return shape;
	}

	/**
	 * 获取指定事件的集合
	 * 
	 * @param {string} name 事件名称
	 * @returns {jmList} 事件委托的集合
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
