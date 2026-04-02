import jmSeries, { ANIMATION_DATA_THRESHOLD, DEFAULT_ANIMATION_COUNT } from './series.js';

/**
 * 气泡图
 *
 * @class jmBubbleSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmBubbleSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.bubble;
		super(options);
	}

	/**
	 * 初始化气泡图
	 *
	 * @method init
	 * @for jmBubbleSeries
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

			this.createBubbleItem(p);
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
	}

	/**
	 * 生成气泡
	 *
	 * @method createBubbleItem
	 * @for jmBubbleSeries
	 * @param {object} p 数据点
	 */
	createBubbleItem(p) {
		// 获取气泡的大小，从数据中指定
		const size = typeof p.size === 'number' ? p.size : 10;
		const radius = Math.sqrt(size) * (this.style.radiusScale || 1);
		
		// 获取气泡的颜色，可以从数据中指定或使用系列颜色
		const color = p.color || this.style.color;
		
		// 获取气泡的透明度，可以从数据中指定或使用默认值
		const opacity = typeof p.opacity === 'number' ? p.opacity : (this.style.opacity || 0.6);
		
		const bubbleStyle = this.graph.utils.clone(this.style.item, {
			stroke: color,
			fill: color,
			opacity: opacity
		});

		const bubbleShape = this.graph.createShape('circle', {
			style: bubbleStyle,
			center: p,
			radius: radius
		});

		bubbleShape.zIndex = (bubbleShape.style.zIndex || 1) + 1;
		return this.addShape(bubbleShape);
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend
	 * @for jmBubbleSeries
	 */
	createLegend() {
		const style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		style.fill = style.color;
		style.opacity = style.opacity || 0.6;

		const shape = this.graph.createShape('circle', {
			style: style,
			center: {
				x: this.graph.style.legend.item.shape.width / 2,
				y: this.graph.style.legend.item.shape.height / 2
			},
			radius: this.style.radius || 5
		});
		
		this.graph.legend.append(this, shape);
	}
}