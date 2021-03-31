import * as jmgraph from 'jmgraph/src/core/jmGraph.js';
import jmRect from 'jmgraph/src/shapes/jmRect.js';
import  jmLine from 'jmgraph/src/shapes/jmLine.js';
import defaultStyle from './common/style.js';
import jmAxis from './core/axis/axis.js';
import jmLegend from './core/legend/legend.js';
import jmBarSeries from './series/barSeries.js';
import jmPieSeries from './series/pieSeries.js';

import jmLineSeries from './series/lineSeries.js';
import jmStackLineSeries from './series/stackLineSeries.js';
import jmMarkLine from './core/axis/markLine';

/**
 * jm图表组件
 * option参数:graph=jmgraph
 *
 * @class jmChart
 * @module jmChart
 * @param {element} container 图表容器
 */
export default class jmChart extends jmgraph.jmGraph  {

	constructor(container, options) {
		options = options||{};

		const enableAnimate = !!options.enableAnimate;
		options.autoRefresh = typeof options.autoRefresh === 'undefined'? enableAnimate: options.autoRefresh;

		if(enableAnimate && !options.autoRefresh) {
			console.warn('开启了动画，却没有开户自动刷新');
		}

		 // 深度复制默认样式，以免被改
		options.style = jmgraph.jmUtils.clone(defaultStyle, options.style, true);

		super(container, options);

		this.enableAnimate = enableAnimate;
		this.data = options.data || [];
		// x轴绑定的字段名
		this.xField = options.xField || '';	

		this.init(options);	

		// 创建操作图层
		this.createTouchGraph(this.container, options);
	}

	/**
	 * 绑定的数据源
	 */
	data = [];	

	/**
	 * 当前所有图
	 */
	series = new jmgraph.jmList();

	/**
	 * 是否启用动画
	 */
	enableAnimate = false;

	// 初始化图表
	init(options) {

		/**
		 * 绘图区域
		 *
		 * @property chartArea
		 * @type jmControl
		 */
		if(!this.chartArea) {
			this.chartArea = this.createShape(jmRect, {
				style: this.style.chartArea,
				position: { x: 0, y: 0}
			});
			this.children.add(this.chartArea);
		}

		/**
		 * 图例
		 *
		 * @property legend
		 * @type jmLegend
		 */
		this.legend = this.legend || this.createShape(jmLegend, {
			style: this.style.legend
		});
		this.children.add(this.legend);
		// 不显示图例
		if(options.legendVisible === false) {
			this.legend.visible = false;
		}

		/**
		 * 图表提示控件
		 *
		 * @property tooltip
		 * @type jmTooltip
		 */
		//this.tooltip = this.graph.createShape('tooltip',{style:this.style.tooltip});
		//this.chartArea.children.add(this.tooltip);

		this.createXAxis();// 生成X轴
	}

	// 创建一个操作层，以免每次刷新
	createTouchGraph(container, options) {
		if(container.tagName === 'CANVAS') {
			container = container.parentElement;
		}
		container.style.position = 'relative';

		options = this.utils.clone(options, {
			autoRefresh: true
		}, true);

		let graph = this.touchGraph = this;

		// 生成图层, 当图刷新慢时，需要用一个操作图层来进行滑动等操作重绘
		if(options.touchGraph) {
			let cn = document.createElement('canvas');
			cn.width = container.offsetWidth||container.clientWidth;
			cn.height = container.offsetHeight||container.clientHeight;
			cn.style.position = 'absolute';
			cn.style.top = 0;
			cn.style.left = 0;

			this.touchGraph = graph = new jmgraph.jmGraph(cn, options);
			
			container.appendChild(cn);

			this.touchGraph.chartGraph = this;

			this.on('propertyChange', (name, args) => {
				if(['width', 'height'].includes(name)) {
					this.touchGraph[name] = args.newValue / this.devicePixelRatio;
				}
			});
		}

		if(this.style.markLine)  {

			graph.on('beginDraw', () => {
				// 重置标线，会处理小圆圈问题
				this.xMarkLine && this.xMarkLine.init();
				this.yMarkLine && this.yMarkLine.init();
			});

			// 生成标线，可以跟随鼠标或手指滑动
			if(this.style.markLine && this.style.markLine.x) {
				this.xMarkLine = graph.createShape(jmMarkLine, {
					type: 'x',
					style: this.style.markLine
				});
				const area = graph.chartArea || graph;
				area.children.add(this.xMarkLine);
			}

			if(this.style.markLine && this.style.markLine.y) {
				this.yMarkLine = graph.createShape(jmMarkLine, {
					type: 'y',
					style: this.style.markLine
				});
				const area = graph.chartArea || graph;
				area.children.add(this.yMarkLine);
			}

			graph.on('mousedown touchstart', (args) => {
				if(this.xMarkLine) {
					this.xMarkLine.visible = true;
					this.xMarkLine.move(args);
				}
				if(this.yMarkLine) {
					this.yMarkLine.visible = true;
					this.yMarkLine.move(args);
				}
			});
			// 移动标线
			graph.on('mousemove touchmove', (args) => {
				if(this.xMarkLine && this.xMarkLine.visible) {
					this.xMarkLine.move(args);
				}
				if(this.yMarkLine && this.yMarkLine.visible) {
					this.yMarkLine.move(args);
				}
			});
			// 取消移动
			graph.on('mouseup touchend touchcancel touchleave', (args) => {
				if(this.xMarkLine && this.xMarkLine.visible) {
					this.xMarkLine.cancel(args);
				}
				if(this.yMarkLine && this.yMarkLine.visible) {
					this.yMarkLine.cancel(args);
				}
			});
		}
	}
	
	// 重置整个图表
	reset() {
		// 清空当前图形，重新生成
		let serie;
		while(serie = this.series.shift()) {
			
			// 重置所有图形
			let shape;
			while(shape = serie.shapes.shift()) {
				shape && shape.remove();
			}
			
			serie.remove();
		}

		// 轴删除
		if(this.xAxis) {
			this.xAxis.remove();
			delete this.xAxis;
		}
		if(this.yAxises) {
			for(let i in this.yAxises) {
				this.yAxises[i].remove();
			}
			delete this.yAxises;
		}
	}
	/**
	 * 获取颜色
	 *
	 * @method getColor 
	 * @param {int} index 颜色索引
	 */
	getColor(index) {	
		//如果颜色超过最大个数，则重新获取	
		if(index >= this.style.chartColors.length) {
			index = Math.floor((index - 1) / this.style.chartColors.length)
		}
		return this.style.chartColors[index];
	}

	/**
	 * 绘制当前图表
	 * 先绘制轴等基础信息
	 *
	 * @method beginDraw 
	 */
	beginDraw() {
		//const startTime = Date.now();
		//重置图例
		this.legend && this.legend.init();

		//先定位图例等信息，确定画图区域
		this.resetAreaPosition();

		if(this.xAxis) {
			this.xAxis.clear();
		}

		//计算Y轴位置
		if(this.yAxises) {
			for(let i in this.yAxises) {
				this.yAxises[i].clear();
			}
		}

		//console.log('beginDraw1', Date.now() - startTime);

		//计算柱形图个数
		this.barSeriesCount = 0;
		//初始化图序列，并初始化轴值,生成图例项
		this.series.each(function(i, serie) {
			//设定边框颜色和数据项图示颜 色
			serie.style.color = serie.style.color || serie.graph.getColor(i);
			//如果排版指定非内缩的方式，但出现了柱图，还是会采用内缩一个刻度的方式
			if(serie.graph.style.layout != 'inside') {
				if(serie.graph.utils.isType(serie, jmBarSeries)) {			
						serie.graph.style.layout = 'inside';
				}
			}
			
			//对柱图计算,并标记为第几个柱图，用为排列
			if(serie.graph.utils.isType(serie, jmBarSeries)) {
				serie.barIndex = serie.graph.barSeriesCount;
				serie.graph.barSeriesCount ++;
			}
			serie.reset();
		});	
		//console.log('beginDraw2', Date.now() - startTime);
		//重置图例
		this.legend && this.legend.reset();	

		if(this.xAxis) {
			this.xAxis.reset();
		}

		//计算Y轴位置
		if(this.yAxises) {
			for(var i in this.yAxises) {
				this.yAxises[i].reset();
			}
		}
		//console.log('beginDraw3', Date.now() - startTime);
		//最后再来初始化图形，这个必须在轴初始化完后才能执行
		this.series.each(function(i, serie) {		
			serie.init && serie.init();
		});	
		//console.log('beginDraw4', Date.now() - startTime);
	}

	/**
	 * 重新定位区域的位置
	 *
	 * @method resetAreaPosition
	 */
	resetAreaPosition() {
		this.chartArea.position.x = (this.style.margin.left || 0) * this.graph.devicePixelRatio;
		this.chartArea.position.y = (this.style.margin.top || 0) * this.graph.devicePixelRatio;
		const w = this.width - (this.style.margin.right * this.graph.devicePixelRatio) - this.chartArea.position.x;
		const h = this.height - (this.style.margin.bottom * this.graph.devicePixelRatio) - this.chartArea.position.y;

		this.chartArea.width = w;
		this.chartArea.height = h;
	}

	/**
	 * 创建轴
	 *
	 * @method createAxis
	 * @for jmChart
	 * @param {string} [type] 轴类型(x/y/radar),默认为x
	 * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
	 * @param {object} [style] 样式
	 * @return {axis} 轴
	 */
	createAxis(options) {
		// 深度组件默认样式
		options.style = options.style? this.utils.clone(this.style.axis, options.style, true) : this.style.axis;

		const axis = this.createShape(jmAxis, options);
		this.children.add(axis);
		return axis;
	}

	/**
	 * 生成X轴
	 *
	 * @method createXAxis
	 * @param {string} x轴的数据类型(string/number/date)
	 * @param {bool} 是否从0开始
	 */ 
	createXAxis(options) {
		if(!this.xAxis) {
			options = Object.assign({
				field: this.xField,
				type: 'x',
				format: this.options.xLabelFormat
			}, options || {});
			
			if(typeof this.options.minXValue !== 'undefined') {
				options.minXValue = typeof options.minXValue === 'undefined'?this.options.minXValue:Math.min(this.options.minXValue, options.minXValue);
			}
			if(typeof this.options.maxXValue !== 'undefined') {
				options.maxXValue =  typeof options.maxXValue === 'undefined'?this.options.maxXValue:Math.max(this.options.maxXValue, options.maxXValue);
			}
			this.xAxis = this.createAxis(options);
		}
		return this.xAxis;
	}

	/**
	 * 生成Y轴
	 *
	 * @method createYAxis
	 * @param {int} Y轴索引，可以创建多个Y轴
	 * @param {string} y轴的数据类型(string/number/date)
	 * @param {bool} 是否从0开始
	 */ 
	createYAxis(options) {	

		if(!this.yAxises) {
			this.yAxises = {};		
		}
		options = Object.assign({
			index: 1,
			type: 'y',
			format: this.options.yLabelFormat,
		}, options || {});
		if(typeof this.options.minYValue !== 'undefined') {
			options.minYValue = typeof options.minYValue === 'undefined'?this.options.minYValue:Math.min(this.options.minYValue, options.minYValue);
		}
		if(typeof this.options.maxYValue !== 'undefined') {
			options.maxYValue =  typeof options.maxYValue === 'undefined'?this.options.maxYValue:Math.max(this.options.maxYValue, options.maxYValue);
		}
		
		var yaxis = this.yAxises[options.index] || (this.yAxises[options.index] = this.createAxis(options));
		return yaxis;
	}

	/**
	 * 创建图形
	 *
	 * @method createSeries
	 * @for jmChart
	 * @param {string} [type] 图类型，（line/bar/pie/radar）
	 * @param {object} [options] 生成图表选项 {xField, yField, index}
	 * @return {series} 图形
	 */
	createSeries(type, options = {}) {
		if(!this.serieTypes) {
			this.serieTypes = {
				'line' : jmLineSeries,
				'bar' : jmBarSeries,
				'pie' : jmPieSeries,
				'stackLine' : jmStackLineSeries
			};		
		}

		//默认样式为类型对应的样式
		const style = this.style[type] || this.style['line'];
		// 深度组件默认样式
		options.style = this.utils.clone(style, options.style, true);

		if(typeof type == 'string') type = this.serieTypes[type];
		
		const serie = this.createShape(type, options);
		if(serie) {
			this.series.add(serie);
			this.chartArea.children.add(serie);
		}
		return serie;
	}
}