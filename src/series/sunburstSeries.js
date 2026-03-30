import jmSeries from './series.js';

/**
 * 旭日图
 * 
 * 旭日图用于展示层级数据的占比关系，由多个同心圆环组成，每个圆环代表一个层级。
 * 内层圆环是外层圆环的父级，扇形角度代表数据占比。
 * 
 * 数据格式要求：
 * - 树形结构数据，每个节点包含 name、value 和 children
 * 
 * 样式配置：
 * - innerRadius: 内圆半径，默认 0
 * - startAngle: 起始角度，默认 0
 * - showLabels: 是否显示标签，默认 true
 *
 * @class jmSunburstSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('sunburst', {
 *   data: [{
 *     name: 'Root',
 *     children: [
 *       { name: 'A', value: 30 },
 *       { name: 'B', value: 70 }
 *     ]
 *   }]
 * });
 */
export default class jmSunburstSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.sunburst;
		super(options);
		this.maxDepth = 0;
	}

	/**
	 * 初始化旭日图
	 */
	init() {
		const data = this.option.data || this.data;
		if(!data || !data.length) return;

		const chartWidth = this.graph.chartArea.width;
		const chartHeight = this.graph.chartArea.height;
		const centerX = chartWidth / 2;
		const centerY = chartHeight / 2;
		const maxRadius = Math.min(chartWidth, chartHeight) / 2 - 20;

		this.maxDepth = this.calculateMaxDepth(data);
		if(this.maxDepth === 0) return;

		const ringWidth = maxRadius / this.maxDepth;
		const innerRadius = this.style.innerRadius || 0;

		this.drawLevel(data, centerX, centerY, innerRadius, ringWidth, 0, 360, 0);

		if(this.style.showCenter !== false && innerRadius > 0) {
			this.drawCenter(centerX, centerY, innerRadius);
		}
	}

	/**
	 * 计算最大深度
	 */
	calculateMaxDepth(data, depth = 1) {
		let maxDepth = depth;
		for(const node of data) {
			if(node.children && node.children.length > 0) {
				const childDepth = this.calculateMaxDepth(node.children, depth + 1);
				maxDepth = Math.max(maxDepth, childDepth);
			}
		}
		return maxDepth;
	}

	/**
	 * 计算节点总值
	 */
	calculateTotalValue(data) {
		let total = 0;
		for(const node of data) {
			if(node.children && node.children.length > 0) {
				total += this.calculateTotalValue(node.children);
			} else {
				total += node.value || 0;
			}
		}
		return total;
	}

	/**
	 * 绘制层级
	 */
	drawLevel(data, centerX, centerY, innerRadius, ringWidth, startAngle, totalAngle, level) {
		const total = this.calculateTotalValue(data);
		if(total === 0) return;

		let currentAngle = startAngle;
		const outerRadius = innerRadius + ringWidth;

		for(const node of data) {
			let nodeValue = 0;
			if(node.children && node.children.length > 0) {
				nodeValue = this.calculateTotalValue(node.children);
			} else {
				nodeValue = node.value || 0;
			}

			const angleRatio = nodeValue / total;
			const nodeAngle = totalAngle * angleRatio;
			const endAngle = currentAngle + nodeAngle;

			if(nodeAngle > 0.1) {
				const color = this.getColor(node, level);
				
				this.drawArc(centerX, centerY, innerRadius, outerRadius, currentAngle, endAngle, color, node);

				if(this.style.showLabels !== false && nodeAngle > 10) {
					this.drawLabel(centerX, centerY, innerRadius, outerRadius, currentAngle, endAngle, node);
				}

				if(node.children && node.children.length > 0) {
					this.drawLevel(node.children, centerX, centerY, outerRadius, ringWidth, currentAngle, nodeAngle, level + 1);
				}
			}

			currentAngle = endAngle;
		}
	}

	/**
	 * 绘制扇形
	 */
	drawArc(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, color, node) {
		const arc = this.graph.createShape('arc', {
			style: {
				fill: color,
				stroke: this.style.stroke || '#fff',
				lineWidth: this.style.lineWidth || 1,
				zIndex: 1
			},
			center: { x: centerX, y: centerY },
			radius: outerRadius,
			innerRadius: innerRadius,
			startAngle: startAngle - 90,
			endAngle: endAngle - 90
		});

		this.addShape(arc);
		node.shape = arc;
	}

	/**
	 * 绘制标签
	 */
	drawLabel(centerX, centerY, innerRadius, outerRadius, startAngle, endAngle, node) {
		const midAngle = (startAngle + endAngle) / 2 - 90;
		const midRadius = (innerRadius + outerRadius) / 2;
		
		const x = centerX + midRadius * Math.cos(midAngle * Math.PI / 180);
		const y = centerY + midRadius * Math.sin(midAngle * Math.PI / 180);

		const text = node.name || '';
		if(!text) return;

		const label = this.graph.createShape('label', {
			style: {
				fill: this.style.labelColor || '#fff',
				font: this.style.labelFont || '12px Arial',
				textAlign: 'center',
				textBaseline: 'middle',
				zIndex: 10
			},
			text: text,
			position: { x, y }
		});

		this.addShape(label);
	}

	/**
	 * 绘制中心
	 */
	drawCenter(centerX, centerY, innerRadius) {
		const centerCircle = this.graph.createShape('circle', {
			style: {
				fill: this.style.centerFill || '#fff',
				stroke: this.style.centerStroke || '#e0e0e0',
				lineWidth: 1,
				zIndex: 0
			},
			center: { x: centerX, y: centerY },
			radius: innerRadius
		});

		this.addShape(centerCircle);
	}

	/**
	 * 获取颜色
	 */
	getColor(node, level) {
		if(node.color) return node.color;
		
		if(this.style.colors && this.style.colors.length > 0) {
			return this.style.colors[level % this.style.colors.length];
		}
		
		if(typeof this.style.color === 'function') {
			return this.style.color.call(this, node, level);
		}
		
		return this.graph.getColor(level);
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

export { jmSunburstSeries };
