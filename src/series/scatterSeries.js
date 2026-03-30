import jmSeries from './series.js';

const ANIMATION_DATA_THRESHOLD = 100;
const DEFAULT_ANIMATION_COUNT = 10;

/**
 * 散点图
 *
 * @class jmScatterSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmScatterSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.scatter;
		super(options);
	}

	/**
	 * 初始化散点图
	 *
	 * @method init
	 * @for jmScatterSeries
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

			this.createPointItem(p);
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
	 * 生成散点
	 *
	 * @method createPointItem
	 * @for jmScatterSeries
	 * @param {object} p 数据点
	 */
	createPointItem(p) {
		// 获取点的大小，可以从数据中指定或使用默认值
		const radius = typeof p.size === 'number' ? p.size : (this.style.radius || 5);
		
		// 获取点的颜色，可以从数据中指定或使用系列颜色
		const color = p.color || this.style.color;
		
		const pointStyle = this.graph.utils.clone(this.style.item, {
			stroke: color,
			fill: color
		});

		const pointShape = this.graph.createShape('circle', {
			style: pointStyle,
			center: p,
			radius: radius
		});

		pointShape.zIndex = (pointShape.style.zIndex || 1) + 1;
		return this.addShape(pointShape);
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend
	 * @for jmScatterSeries
	 */
	createLegend() {
		// 生成图例前的图标
		var style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		style.fill = style.color;
		
		var shape = this.graph.createShape('circle', {
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

export {
	jmScatterSeries
}