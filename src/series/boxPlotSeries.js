import jmSeries from './series.js';

/**
 * 箱线图
 * 
 * 箱线图用于展示数据的分布情况，包括最小值、第一四分位数(Q1)、中位数(Q2)、第三四分位数(Q3)和最大值。
 * 可以直观地显示数据的集中趋势、离散程度和异常值。
 * 
 * 数据格式要求：
 * - field: ['min', 'q1', 'median', 'q3', 'max'] - 五个数值字段
 * - xField: 'category' - 分类字段
 * 
 * 样式配置：
 * - boxWidth: 箱体宽度，默认自动计算
 * - whiskerWidth: 须线宽度，默认 1
 * - showOutliers: 是否显示异常值，默认 false
 *
 * @class jmBoxPlotSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('boxPlot', {
 *   field: ['min', 'q1', 'median', 'q3', 'max'],
 *   xField: 'category'
 * });
 */
export default class jmBoxPlotSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.boxPlot;
		super(options);
	}

	/**
	 * 初始化箱线图
	 */
	init() {
		const data = this.data;
		if(!data || !data.length) return;

		const chartWidth = this.graph.chartArea.width;
		const chartHeight = this.graph.chartArea.height;

		const fields = Array.isArray(this.field) ? this.field : [this.field];
		if(fields.length < 5) {
			console.warn('箱线图需要5个字段（min, q1, median, q3, max）');
			return;
		}

		let allValues = [];
		for(const item of data) {
			for(const f of fields) {
				const v = item[f];
				if(v != null && !isNaN(v)) {
					allValues.push(v);
				}
			}
		}

		if(allValues.length === 0) return;

		const minValue = allValues.reduce((a, b) => Math.min(a, b));
		const maxValue = allValues.reduce((a, b) => Math.max(a, b));
		const valueRange = maxValue - minValue || 1;

		const boxWidth = this.style.boxWidth || (chartWidth / data.length * 0.5);
		const whiskerWidth = this.style.whiskerWidth || 1;
		const xField = this.option.xField || 'category';

		const step = chartWidth / data.length;

		for(let i = 0; i < data.length; i++) {
			const item = data[i];

			const min = item[fields[0]];
			const q1 = item[fields[1]];
			const median = item[fields[2]];
			const q3 = item[fields[3]];
			const max = item[fields[4]];

			if([min, q1, median, q3, max].some(v => v == null || isNaN(v))) {
				continue;
			}

			const minYPos = chartHeight - ((min - minValue) / valueRange) * chartHeight;
			const q1YPos = chartHeight - ((q1 - minValue) / valueRange) * chartHeight;
			const medianYPos = chartHeight - ((median - minValue) / valueRange) * chartHeight;
			const q3YPos = chartHeight - ((q3 - minValue) / valueRange) * chartHeight;
			const maxYPos = chartHeight - ((max - minValue) / valueRange) * chartHeight;

			const centerX = step * i + step / 2;
			const leftX = centerX - boxWidth / 2;
			const rightX = centerX + boxWidth / 2;

			const color = this.getColor(item, i);

			this.createBox(leftX, rightX, q1YPos, q3YPos, color);
			this.createMedianLine(leftX, rightX, medianYPos, color);
			this.createWhisker(centerX, minYPos, q1YPos, maxYPos, q3YPos, color, whiskerWidth);

			if(this.style.label && this.style.label.show) {
				this.createBoxLabel(item, centerX, medianYPos, xField);
			}
		}
	}

	/**
	 * 创建箱体
	 */
	createBox(leftX, rightX, q1Y, q3Y, color) {
		const box = this.graph.createShape('rect', {
			style: {
				fill: this.style.boxFill || 'transparent',
				stroke: color,
				lineWidth: this.style.lineWidth || 1,
				zIndex: 1
			},
			position: {
				x: leftX,
				y: Math.min(q1Y, q3Y)
			},
			width: rightX - leftX,
			height: Math.abs(q3Y - q1Y)
		});

		this.addShape(box);
	}

	/**
	 * 创建中位数线
	 */
	createMedianLine(leftX, rightX, medianY, color) {
		const line = this.graph.createShape('line', {
			style: {
				stroke: color,
				lineWidth: (this.style.lineWidth || 1) * 2,
				zIndex: 2
			},
			start: { x: leftX, y: medianY },
			end: { x: rightX, y: medianY }
		});

		this.addShape(line);
	}

	/**
	 * 创建须线
	 */
	createWhisker(centerX, minY, q1Y, maxY, q3Y, color, whiskerWidth) {
		const whiskerLength = this.style.whiskerLength || 20;

		const lowerWhisker = this.graph.createShape('line', {
			style: {
				stroke: color,
				lineWidth: whiskerWidth,
				zIndex: 0
			},
			start: { x: centerX, y: q1Y },
			end: { x: centerX, y: minY }
		});
		this.addShape(lowerWhisker);

		const lowerCap = this.graph.createShape('line', {
			style: {
				stroke: color,
				lineWidth: whiskerWidth,
				zIndex: 0
			},
			start: { x: centerX - whiskerLength / 2, y: minY },
			end: { x: centerX + whiskerLength / 2, y: minY }
		});
		this.addShape(lowerCap);

		const upperWhisker = this.graph.createShape('line', {
			style: {
				stroke: color,
				lineWidth: whiskerWidth,
				zIndex: 0
			},
			start: { x: centerX, y: q3Y },
			end: { x: centerX, y: maxY }
		});
		this.addShape(upperWhisker);

		const upperCap = this.graph.createShape('line', {
			style: {
				stroke: color,
				lineWidth: whiskerWidth,
				zIndex: 0
			},
			start: { x: centerX - whiskerLength / 2, y: maxY },
			end: { x: centerX + whiskerLength / 2, y: maxY }
		});
		this.addShape(upperCap);
	}

	/**
	 * 创建箱线图标签
	 */
	createBoxLabel(item, centerX, medianY, xField) {
		const text = this.option.itemLabelFormat 
			? this.option.itemLabelFormat.call(this, { data: item }) 
			: item[xField];
		
		if(!text) return;

		const label = this.graph.createShape('label', {
			style: {
				fill: this.style.label.fill || '#333',
				font: this.style.label.font || '12px Arial',
				textAlign: 'center',
				textBaseline: 'top',
				zIndex: 10
			},
			text: text,
			position: {
				x: centerX,
				y: medianY + 5
			}
		});

		this.addShape(label);
	}

	/**
	 * 获取颜色
	 */
	getColor(item, index) {
		if(typeof this.style.color === 'function') {
			return this.style.color.call(this, item, index);
		}
		return this.style.color || this.graph.getColor(index);
	}

	/**
	 * 生成图例
	 */
	createLegend() {
		const style = this.graph.utils.clone(this.style);
		style.fill = this.style.boxFill || 'transparent';
		style.stroke = this.style.color || this.graph.getColor(0);
		
		const shape = this.graph.createShape('rect', {
			style: style,
			position: { x: 0, y: 0 },
			width: this.graph.style.legend.item.shape.width,
			height: this.graph.style.legend.item.shape.height
		});
		
		this.graph.legend.append(this, shape);
	}
}
