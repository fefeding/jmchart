import jmSeries, { ANIMATION_DATA_THRESHOLD, DEFAULT_ANIMATION_COUNT } from './series.js';

/**
 * 热力图
 *
 * @class jmHeatmapSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmHeatmapSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.heatmap;
		super(options);
	}

	/**
	 * 初始化热力图
	 *
	 * @method init
	 * @for jmHeatmapSeries
	 */
	init() {
		const {
			points, 
			dataChanged
		} = this.initDataPoint();

		const len = points.length;
		if(!len) return;

		// 计算数据的最大值和最小值，用于颜色映射
		let minValue = Infinity;
		let maxValue = -Infinity;
		
		for(let i = 0; i < len; i++) {
			const p = points[i];
			if(typeof p.value === 'number') {
				minValue = Math.min(minValue, p.value);
				maxValue = Math.max(maxValue, p.value);
			}
		}

		this.minValue = minValue;
		this.maxValue = maxValue;

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

			this.createHeatmapCell(p, minValue, maxValue);
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
	 * 生成热力图单元格
	 *
	 * @method createHeatmapCell
	 * @for jmHeatmapSeries
	 * @param {object} p 数据点
	 * @param {number} minValue 最小值
	 * @param {number} maxValue 最大值
	 */
	createHeatmapCell(p, minValue, maxValue) {
		// 计算单元格大小
		const cellWidth = this.style.cellWidth || 20;
		const cellHeight = this.style.cellHeight || 20;

		// 计算颜色
		const color = this.getHeatmapColor(p.value, minValue, maxValue);

		// 创建矩形单元格
		const cellStyle = this.graph.utils.clone(this.style.item, {
			stroke: color,
			fill: color
		});

		const cellShape = this.graph.createShape('rect', {
			style: cellStyle,
			position: {
				x: p.x - cellWidth / 2,
				y: p.y - cellHeight / 2
			},
			width: cellWidth,
			height: cellHeight
		});

		cellShape.zIndex = (cellShape.style.zIndex || 1) + 1;
		return this.addShape(cellShape);
	}

	/**
	 * 获取热力图颜色
	 *
	 * @method getHeatmapColor
	 * @for jmHeatmapSeries
	 * @param {number} value 当前值
	 * @param {number} minValue 最小值
	 * @param {number} maxValue 最大值
	 * @return {string} 颜色值
	 */
	getHeatmapColor(value, minValue, maxValue) {
		if(typeof value !== 'number') {
			return this.style.defaultColor || '#ccc';
		}

		// 计算值的比例
		const ratio = (value - minValue) / (maxValue - minValue);

		// 使用默认的颜色梯度
		const colors = this.style.colorGradient || [
			'#313695', // 蓝色（最小值）
			'#4575b4',
			'#74add1',
			'#abd9e9',
			'#e0f3f8',
			'#ffffbf',
			'#fee090',
			'#fdae61',
			'#f46d43',
			'#d73027',
			'#a50026'  // 红色（最大值）
		];

		// 根据比例获取颜色
		const index = Math.min(Math.floor(ratio * (colors.length - 1)), colors.length - 1);
		return colors[index];
	}

	/**
	 * 生成图例
	 *
	 * @method createLegend
	 * @for jmHeatmapSeries
	 */
	createLegend() {
		// 生成图例前的图标
		var style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		style.fill = style.color;
		
		var shape = this.graph.createShape('rect', {
			style: style,
			position: {
				x: 0,
				y: 0
			},
			width: this.graph.style.legend.item.shape.width,
			height: this.graph.style.legend.item.shape.height
		});
		
		this.graph.legend.append(this, shape);
	}
}

export {
	jmHeatmapSeries
}