import jmSeries from './series.js';

/**
 * 漏斗图
 * 
 * 漏斗图用于展示数据在不同阶段的转化情况，常用于分析业务流程中的转化率。
 * 每个阶段用一个梯形表示，宽度代表该阶段的数值大小。
 * 
 * 数据格式要求：
 * - field: 'value' - 数值字段
 * - xField: 'name' - 阶段名称字段
 * 
 * 样式配置：
 * - align: 'center'|'left'|'right' - 对齐方式，默认 center
 * - gap: 每层之间的间隔，默认 2
 * - colors: 颜色数组，默认使用图表配色
 *
 * @class jmFunnelSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('funnel', {
 *   field: 'value',
 *   xField: 'name',
 *   style: {
 *     align: 'center',
 *     gap: 2
 *   }
 * });
 */
export default class jmFunnelSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.funnel;
		super(options);
	}

	/**
	 * 初始化漏斗图
	 */
	init() {
		const data = this.data;
		if(!data || !data.length) return;

		const chartWidth = this.graph.chartArea.width;
		const chartHeight = this.graph.chartArea.height;
		const centerX = chartWidth / 2;

		const field = this.field || 'value';
		const xField = this.option.xField || 'name';

		const values = data.map(item => Math.abs(item[field] || 0));
		const maxValue = values.reduce((a, b) => Math.max(a, b));

		if(maxValue === 0) return;

		const align = this.style.align || 'center';
		const gap = this.style.gap || 2;
		const len = data.length;
		const layerHeight = (chartHeight - gap * (len - 1)) / len;

		let currentY = 0;

		for(let i = 0; i < len; i++) {
			const item = data[i];
			const value = values[i];
			const ratio = value / maxValue;
			const width = chartWidth * ratio * 0.8;

			let topLeftX, topRightX, bottomLeftX, bottomRightX;

			const nextValue = i < len - 1 ? values[i + 1] : 0;
			const nextRatio = nextValue / maxValue;
			const nextWidth = chartWidth * nextRatio * 0.8;

			switch(align) {
				case 'left':
					topLeftX = 0;
					topRightX = width;
					bottomLeftX = 0;
					bottomRightX = nextWidth;
					break;
				case 'right':
					topLeftX = chartWidth - width;
					topRightX = chartWidth;
					bottomLeftX = chartWidth - nextWidth;
					bottomRightX = chartWidth;
					break;
				case 'center':
				default:
					topLeftX = centerX - width / 2;
					topRightX = centerX + width / 2;
					bottomLeftX = centerX - nextWidth / 2;
					bottomRightX = centerX + nextWidth / 2;
					break;
			}

			const color = this.getColor(item, i);
			const style = {
				fill: color,
				stroke: this.style.stroke || '#fff',
				lineWidth: this.style.lineWidth || 1,
				zIndex: 1
			};

			const trapezoid = this.graph.createShape('path', {
				style: style,
				points: [
					{ x: topLeftX, y: currentY },
					{ x: topRightX, y: currentY },
					{ x: bottomRightX, y: currentY + layerHeight },
					{ x: bottomLeftX, y: currentY + layerHeight }
				]
			});

			this.addShape(trapezoid);

			if(this.style.label && this.style.label.show !== false) {
				this.createFunnelLabel(item, topLeftX, topRightX, currentY, layerHeight, i, field, xField);
			}

			currentY += layerHeight + gap;
		}
	}

	/**
	 * 创建漏斗图标签
	 */
	createFunnelLabel(item, leftX, rightX, y, height, index, field, xField) {
		const centerX = (leftX + rightX) / 2;
		const text = this.option.itemLabelFormat 
			? this.option.itemLabelFormat.call(this, { data: item, xLabel: item[xField], yValue: item[field] }) 
			: `${item[xField]}: ${item[field]}`;
		
		if(!text) return;

		const label = this.graph.createShape('label', {
			style: {
				fill: this.style.label.fill || '#fff',
				font: this.style.label.font || '12px Arial',
				textAlign: 'center',
				textBaseline: 'middle',
				zIndex: 10
			},
			text: text,
			position: {
				x: centerX,
				y: y + height / 2
			}
		});

		this.addShape(label);
	}

	/**
	 * 获取颜色
	 */
	getColor(item, index) {
		if(this.style.colors && this.style.colors.length > 0) {
			return this.style.colors[index % this.style.colors.length];
		}
		if(typeof this.style.color === 'function') {
			return this.style.color.call(this, item, index);
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
		
		const shape = this.graph.createShape('path', {
			style: style,
			points: [
				{ x: 0, y: 0 },
				{ x: this.graph.style.legend.item.shape.width, y: 0 },
				{ x: this.graph.style.legend.item.shape.width * 0.6, y: this.graph.style.legend.item.shape.height },
				{ x: this.graph.style.legend.item.shape.width * 0.4, y: this.graph.style.legend.item.shape.height }
			]
		});
		
		this.graph.legend.append(this, shape);
	}
}
