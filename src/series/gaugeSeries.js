import jmSeries from './series.js';

const ANIMATION_DATA_THRESHOLD = 100;
const DEFAULT_ANIMATION_COUNT = 10;

/**
 * 仪表盘
 *
 * @class jmGaugeSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmGaugeSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.gauge;
		super(options);
	}

	/**
	 * 初始化仪表盘
	 */
	init() {
		const {
			points, 
			dataChanged
		} = this.initDataPoint();

		const len = points.length;
		if(!len) return;

		const p = points[0];
		const value = typeof p.yValue === 'number' ? p.yValue : 0;

		const min = this.style.min || 0;
		const max = this.style.max || 100;
		const startAngle = this.style.startAngle || -150;
		const endAngle = this.style.endAngle || 150;

		const angleRange = endAngle - startAngle;
		
		const normalizedValue = Math.max(min, Math.min(max, value));
		const ratio = (normalizedValue - min) / (max - min);
		const currentAngle = startAngle + (ratio * angleRange);

		const centerX = this.graph.chartArea.width / 2;
		const centerY = this.graph.chartArea.height / 2;
		const radius = Math.min(centerX, centerY) * (this.style.radiusScale || 0.8);

		this.createGaugeBackground(centerX, centerY, radius, startAngle, endAngle);
		this.createGaugeTicks(centerX, centerY, radius, startAngle, endAngle, min, max);
		this.createGaugePointer(centerX, centerY, radius, currentAngle);
		this.createGaugeCenter(centerX, centerY, radius);
		this.createGaugeValueLabel(centerX, centerY, radius, value);

		this.emit('onPointCreated', p);
	}

	/**
	 * 创建仪表盘背景
	 */
	createGaugeBackground(centerX, centerY, radius, startAngle, endAngle) {
		const backgroundStyle = {
			stroke: this.style.backgroundStroke || '#e0e0e0',
			fill: this.style.backgroundFill || 'transparent',
			lineWidth: this.style.backgroundLineWidth || 20,
			zIndex: 1
		};

		const backgroundArc = this.graph.createShape('arc', {
			style: backgroundStyle,
			center: { x: centerX, y: centerY },
			radius: radius,
			startAngle: startAngle,
			endAngle: endAngle
		});

		this.addShape(backgroundArc);

		if(this.style.gradient) {
			const gradientColors = this.style.gradientColors || [
				{ offset: 0, color: '#52c41a' },
				{ offset: 0.7, color: '#faad14' },
				{ offset: 1, color: '#f5222d' }
			];

			const step = (endAngle - startAngle) / (gradientColors.length - 1);

			for(let i = 0; i < gradientColors.length - 1; i++) {
				const start = startAngle + (step * i);
				const end = startAngle + (step * (i + 1));

				const gradientArc = this.graph.createShape('arc', {
					style: {
						stroke: gradientColors[i].color,
						fill: 'transparent',
						lineWidth: this.style.lineWidth || 15,
						zIndex: 2
					},
					center: { x: centerX, y: centerY },
					radius: radius - (this.style.backgroundLineWidth || 20) / 2,
					startAngle: start,
					endAngle: end
				});

				this.addShape(gradientArc);
			}
		}
	}

	/**
	 * 创建仪表盘刻度
	 */
	createGaugeTicks(centerX, centerY, radius, startAngle, endAngle, min, max) {
		const tickCount = this.style.tickCount || 10;
		const angleStep = (endAngle - startAngle) / (tickCount - 1);

		for(let i = 0; i < tickCount; i++) {
			const angle = startAngle + (angleStep * i);
			const value = min + ((max - min) / (tickCount - 1)) * i;

			const tickStartX = centerX + Math.cos(angle * Math.PI / 180) * (radius - 30);
			const tickStartY = centerY + Math.sin(angle * Math.PI / 180) * (radius - 30);
			const tickEndX = centerX + Math.cos(angle * Math.PI / 180) * (radius - 10);
			const tickEndY = centerY + Math.sin(angle * Math.PI / 180) * (radius - 10);

			const tickLine = this.graph.createShape('line', {
				style: {
					stroke: this.style.tickColor || '#666',
					lineWidth: 2,
					zIndex: 3
				},
				start: { x: tickStartX, y: tickStartY },
				end: { x: tickEndX, y: tickEndY }
			});

			this.addShape(tickLine);

			const labelX = centerX + Math.cos(angle * Math.PI / 180) * (radius - 45);
			const labelY = centerY + Math.sin(angle * Math.PI / 180) * (radius - 45);

			const tickLabel = this.graph.createShape('label', {
				style: {
					fill: this.style.tickLabelColor || '#333',
					font: '12px Arial',
					textAlign: 'center',
					textBaseline: 'middle',
					zIndex: 4
				},
				position: { x: labelX, y: labelY },
				text: value.toString()
			});

			this.addShape(tickLabel);
		}
	}

	/**
	 * 创建仪表盘指针
	 */
	createGaugePointer(centerX, centerY, radius, angle) {
		const pointerLength = radius * 0.7;
		const pointerX = centerX + Math.cos(angle * Math.PI / 180) * pointerLength;
		const pointerY = centerY + Math.sin(angle * Math.PI / 180) * pointerLength;

		const pointerLine = this.graph.createShape('line', {
			style: {
				stroke: this.style.pointerColor || '#333',
				lineWidth: this.style.pointerWidth || 3,
				zIndex: 5
			},
			start: { x: centerX, y: centerY },
			end: { x: pointerX, y: pointerY }
		});

		this.addShape(pointerLine);
	}

	/**
	 * 创建仪表盘中心
	 */
	createGaugeCenter(centerX, centerY, radius) {
		const centerCircle = this.graph.createShape('circle', {
			style: {
				fill: this.style.centerColor || '#333',
				stroke: 'transparent',
				zIndex: 6
			},
			center: { x: centerX, y: centerY },
			radius: this.style.centerRadius || 8
		});

		this.addShape(centerCircle);
	}

	/**
	 * 创建仪表盘值标签
	 */
	createGaugeValueLabel(centerX, centerY, radius, value) {
		const valueLabel = this.graph.createShape('label', {
			style: {
				fill: this.style.valueColor || '#333',
				font: this.style.valueFont || '24px Arial',
				textAlign: 'center',
				textBaseline: 'middle',
				zIndex: 7
			},
			position: { x: centerX, y: centerY + radius * 0.3 },
			text: value.toString()
		});

		this.addShape(valueLabel);

		if(this.style.unit) {
			const unitLabel = this.graph.createShape('label', {
				style: {
					fill: this.style.unitColor || '#666',
					font: this.style.unitFont || '14px Arial',
					textAlign: 'center',
					textBaseline: 'middle',
					zIndex: 8
				},
				position: { x: centerX, y: centerY + radius * 0.5 },
				text: this.style.unit
			});

			this.addShape(unitLabel);
		}
	}

	/**
	 * 生成图例
	 */
	createLegend() {
		var style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		style.fill = style.color;
		
		var shape = this.graph.createShape('arc', {
			style: style,
			center: {
				x: this.graph.style.legend.item.shape.width / 2,
				y: this.graph.style.legend.item.shape.height / 2
			},
			radius: this.graph.style.legend.item.shape.height / 2,
			startAngle: -150,
			endAngle: 150
		});
		
		this.graph.legend.append(this, shape);
	}
}

export {
	jmGaugeSeries
}
