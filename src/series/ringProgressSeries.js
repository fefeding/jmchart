import jmSeries from './series.js';

/**
 * 环形进度图
 * 
 * 环形进度图用于展示单个或多个指标的完成进度或占比情况。
 * 每个指标用一个环形表示，进度用填充的弧线表示。
 * 
 * 数据格式要求：
 * - field: 'value' - 数值字段
 * - 多个指标时使用多个数据项
 * 
 * 样式配置：
 * - radius: 环形半径，默认自动计算
 * - lineWidth: 环形线宽，默认 20
 * - startAngle: 起始角度，默认 -90 (12点钟方向)
 * - max: 最大值，默认 100
 * - showLabel: 是否显示标签，默认 true
 *
 * @class jmRingProgressSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('ringProgress', {
 *   field: 'value',
 *   style: {
 *     lineWidth: 15,
 *     max: 100,
 *     showLabel: true
 *   }
 * });
 */
export default class jmRingProgressSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.ringProgress;
		super(options);
	}

	/**
	 * 初始化环形进度图
	 */
	init() {
		const data = this.data;
		if(!data || !data.length) return;

		const chartWidth = this.graph.chartArea.width;
		const chartHeight = this.graph.chartArea.height;
		const centerX = chartWidth / 2;
		const centerY = chartHeight / 2;

		const maxRadius = Math.min(chartWidth, chartHeight) / 2 - 20;
		const lineWidth = this.style.lineWidth || 20;
		const startAngle = this.style.startAngle !== undefined ? this.style.startAngle : -90;
		const maxValue = this.style.max || 100;
		const field = this.field || 'value';

		const len = data.length;
		const ringGap = this.style.ringGap || 10;
		const totalRingSpace = len * lineWidth + (len - 1) * ringGap;
		const availableRadius = maxRadius - totalRingSpace / 2;

		for(let i = 0; i < len; i++) {
			const item = data[i];
			const value = Math.max(0, Math.min(maxValue, item[field] || 0));
			const ratio = value / maxValue;

			const radius = availableRadius + (len - 1 - i) * (lineWidth + ringGap);

			this.createRingBackground(centerX, centerY, radius, lineWidth, i);
			this.createRingProgress(centerX, centerY, radius, lineWidth, startAngle, ratio, i);

			if(this.style.showLabel !== false) {
				this.createRingLabel(centerX, centerY, radius, value, maxValue, i, item);
			}
		}
	}

	/**
	 * 创建环形背景
	 */
	createRingBackground(centerX, centerY, radius, lineWidth, index) {
		const bgColor = this.style.backgroundColor || '#e0e0e0';
		
		const bgArc = this.graph.createShape('arc', {
			style: {
				stroke: bgColor,
				fill: 'transparent',
				lineWidth: lineWidth,
				zIndex: 0
			},
			center: { x: centerX, y: centerY },
			radius: radius,
			startAngle: 0,
			endAngle: 360
		});

		this.addShape(bgArc);
	}

	/**
	 * 创建环形进度
	 */
	createRingProgress(centerX, centerY, radius, lineWidth, startAngle, ratio, index) {
		if(ratio <= 0) return;

		const color = this.getColor(null, index);
		const endAngle = startAngle + ratio * 360;

		const progressArc = this.graph.createShape('arc', {
			style: {
				stroke: color,
				fill: 'transparent',
				lineWidth: lineWidth,
				zIndex: 1,
				...this.style.progressStyle
			},
			center: { x: centerX, y: centerY },
			radius: radius,
			startAngle: startAngle,
			endAngle: endAngle
		});

		this.addShape(progressArc);
	}

	/**
	 * 创建环形标签
	 */
	createRingLabel(centerX, centerY, radius, value, maxValue, index, item) {
		const text = this.option.itemLabelFormat 
			? this.option.itemLabelFormat.call(this, { yValue: value, index, data: item }) 
			: `${Math.round(value / maxValue * 100)}%`;
		
		if(!text) return;

		const label = this.graph.createShape('label', {
			style: {
				fill: this.style.labelColor || '#333',
				font: this.style.labelFont || '14px Arial',
				textAlign: 'center',
				textBaseline: 'middle',
				zIndex: 10
			},
			text: text,
			position: {
				x: centerX,
				y: centerY
			}
		});

		if(index === 0) {
			this.addShape(label);
		}
	}

	/**
	 * 获取颜色
	 */
	getColor(point, index) {
		if(this.style.colors && this.style.colors.length > 0) {
			return this.style.colors[index % this.style.colors.length];
		}
		if(typeof this.style.color === 'function') {
			return this.style.color.call(this, point, index);
		}
		return this.graph.getColor(index);
	}

	/**
	 * 生成图例
	 */
	createLegend() {
		const style = this.graph.utils.clone(this.style);
		style.fill = this.style.color || this.graph.getColor(0);
		style.stroke = style.fill;
		
		const shape = this.graph.createShape('circle', {
			style: style,
			center: {
				x: this.graph.style.legend.item.shape.width / 2,
				y: this.graph.style.legend.item.shape.height / 2
			},
			radius: this.graph.style.legend.item.shape.height / 2
		});
		
		this.graph.legend.append(this, shape);
	}
}

export { jmRingProgressSeries };
