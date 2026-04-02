import jmSeries, { ANIMATION_DATA_THRESHOLD, DEFAULT_ANIMATION_COUNT } from './series.js';

export default class jmWaterfallSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.waterfall;
		super(options);
	}

	init() {
		const {
			points, 
			dataChanged
		} = this.initDataPoint();

		const len = points.length;
		if(!len) return;

		this.pointsLen = len;
		this.style.stroke = this.style.color;

		let cumulativeValue = 0;
		const processedPoints = [];

		for(let i = 0; i < len; i++) {
			const p = points[i];
			if(typeof p.y === 'undefined' || p.y === null) {
				continue;
			}

			p.originalValue = p.yValue;
			p.startValue = cumulativeValue;
			p.endValue = cumulativeValue + p.yValue;
			cumulativeValue = p.endValue;

			processedPoints.push(p);
		}

		let minValue = Infinity;
		let maxValue = -Infinity;

		for(const p of processedPoints) {
			minValue = Math.min(minValue, p.startValue, p.endValue);
			maxValue = Math.max(maxValue, p.startValue, p.endValue);
		}

		if(this.yAxis) {
			this.yAxis.min(minValue);
			this.yAxis.max(maxValue);
		}

		const minY = this.yAxis ? this.yAxis.min() : 0;
		const ystep = this.yAxis ? this.yAxis.step() : 1;
		const chartHeight = this.graph.chartArea.height;

		const isRunningAni = this.enableAnimate && (dataChanged || this.___animateCounter > 0) && len < ANIMATION_DATA_THRESHOLD;

		const aniCount = (this.style.aniCount || DEFAULT_ANIMATION_COUNT);
		const aniStep = Math.floor(len / aniCount) || 1;

		for(let i = 0; i < processedPoints.length; i++) {
			const p = processedPoints[i];

			if(isRunningAni && i > this.___animateCounter) {
				break;
			}

			const startY = chartHeight - (p.startValue - minY) * ystep;
			const endY = chartHeight - (p.endValue - minY) * ystep;
			const height = Math.abs(endY - startY);

			let barColor = this.style.color;
			if(p.yValue > 0) {
				barColor = this.style.increaseColor || '#52c41a';
			} else if(p.yValue < 0) {
				barColor = this.style.decreaseColor || '#f5222d';
			}

			this.createWaterfallBar(p, startY, endY, height, barColor);

			if(i < processedPoints.length - 1) {
				this.createConnectorLine(p, processedPoints[i + 1], chartHeight, minY, ystep);
			}

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

	createWaterfallBar(p, startY, endY, height, color) {
		const barWidth = this.style.perWidth || 0.5;
		const chartWidth = this.graph.chartArea.width;
		const barX = p.x - (chartWidth * barWidth / this.pointsLen) / 2;
		const barHeight = height;

		const barStyle = {
			stroke: color,
			fill: color,
			zIndex: 1
		};

		const barShape = this.graph.createShape('rect', {
			style: barStyle,
			position: {
				x: barX,
				y: Math.min(startY, endY)
			},
			width: chartWidth * barWidth / this.pointsLen,
			height: barHeight
		});

		this.addShape(barShape);
	}

	createConnectorLine(currentPoint, nextPoint, chartHeight, minY, ystep) {
		const startY = chartHeight - (currentPoint.endValue - minY) * ystep;
		const chartWidth = this.graph.chartArea.width;
		const barWidth = this.style.perWidth || 0.5;
		const nextX = nextPoint.x - (chartWidth * barWidth / this.pointsLen) / 2;

		const horizontalLine = this.graph.createShape('line', {
			style: {
				stroke: this.style.connectorColor || '#999',
				lineWidth: 1,
				lineType: 'dotted',
				zIndex: 0
			},
			start: { x: currentPoint.x, y: startY },
			end: { x: nextX, y: startY }
		});

		this.addShape(horizontalLine);

		const nextStartY = chartHeight - (nextPoint.startValue - minY) * ystep;

		const verticalLine = this.graph.createShape('line', {
			style: {
				stroke: this.style.connectorColor || '#999',
				lineWidth: 1,
				zIndex: 0
			},
			start: { x: nextX, y: startY },
			end: { x: nextX, y: nextStartY }
		});

		this.addShape(verticalLine);
	}

	createLegend() {
		const style = this.graph.utils.clone(this.style);
		style.stroke = this.style.color;
		style.fill = this.style.color;
		
		const shape = this.graph.createShape('rect', {
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
