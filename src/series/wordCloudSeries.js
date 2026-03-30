import jmSeries from './series.js';

/**
 * 词云图
 * 
 * 词云图用于展示文本数据中词语的频率或重要性，词语大小与其权重成正比。
 * 常用于文本分析、舆情监控等场景。
 * 
 * 数据格式要求：
 * - field: 'weight' - 权重字段
 * - xField: 'word' - 词语字段
 * 
 * 样式配置：
 * - minFontSize: 最小字体大小，默认 12
 * - maxFontSize: 最大字体大小，默认 60
 * - colors: 颜色数组
 * - spiral: 是否使用螺旋布局，默认 true
 *
 * @class jmWordCloudSeries
 * @module jmChart
 * @extends jmSeries
 * 
 * @example
 * chart.createSeries('wordCloud', {
 *   field: 'weight',
 *   xField: 'word',
 *   style: {
 *     minFontSize: 14,
 *     maxFontSize: 48
 *   }
 * });
 */
export default class jmWordCloudSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.wordCloud;
		super(options);
		this.placedWords = [];
	}

	/**
	 * 初始化词云图
	 */
	init() {
		const data = this.data;
		if(!data || !data.length) return;

		this.placedWords = [];

		const chartWidth = this.graph.chartArea.width;
		const chartHeight = this.graph.chartArea.height;
		const centerX = chartWidth / 2;
		const centerY = chartHeight / 2;

		const field = this.field || 'weight';
		const xField = this.option.xField || 'word';

		const weights = data.map(item => Math.abs(item[field] || 0));
		const maxWeight = Math.max(...weights);
		const minWeight = Math.min(...weights);

		if(maxWeight === 0) return;

		const minFontSize = this.style.minFontSize || 12;
		const maxFontSize = this.style.maxFontSize || 60;

		const sortedData = [...data].sort((a, b) => (b[field] || 0) - (a[field] || 0));

		for(let i = 0; i < sortedData.length; i++) {
			const item = sortedData[i];
			const weight = item[field] || 0;

			let fontSize;
			if(maxWeight === minWeight) {
				fontSize = (minFontSize + maxFontSize) / 2;
			} else {
				fontSize = minFontSize + (weight - minWeight) / (maxWeight - minWeight) * (maxFontSize - minFontSize);
			}

			const color = this.getColor(item, i);
			const text = item[xField] || '';

			if(!text) continue;

			const position = this.findPosition(centerX, centerY, text, fontSize, chartWidth, chartHeight);

			if(position) {
				this.createWordLabel(text, position.x, position.y, fontSize, color, item);

				this.placedWords.push({
					x: position.x,
					y: position.y,
					width: position.width,
					height: position.height
				});
			}
		}
	}

	/**
	 * 查找词语位置
	 */
	findPosition(centerX, centerY, text, fontSize, chartWidth, chartHeight) {
		const estimatedWidth = text.length * fontSize * 0.6;
		const estimatedHeight = fontSize * 1.2;

		if(this.style.spiral !== false) {
			return this.findSpiralPosition(centerX, centerY, estimatedWidth, estimatedHeight, chartWidth, chartHeight);
		} else {
			return this.findGridPosition(centerX, centerY, estimatedWidth, estimatedHeight, chartWidth, chartHeight);
		}
	}

	/**
	 * 螺旋布局查找位置
	 */
	findSpiralPosition(centerX, centerY, width, height, chartWidth, chartHeight) {
		const spiralStep = 5;
		const maxRadius = Math.max(chartWidth, chartHeight);
		let angle = 0;
		let radius = 0;

		for(let i = 0; i < 1000; i++) {
			const x = centerX + radius * Math.cos(angle) - width / 2;
			const y = centerY + radius * Math.sin(angle) - height / 2;

			if(this.canPlace(x, y, width, height, chartWidth, chartHeight)) {
				return { x, y, width, height };
			}

			angle += 0.5;
			radius += spiralStep * 0.02;
			
			if(radius > maxRadius) break;
		}

		return null;
	}

	/**
	 * 网格布局查找位置
	 */
	findGridPosition(centerX, centerY, width, height, chartWidth, chartHeight) {
		const gridSize = 20;
		const halfWidth = chartWidth / 2;
		const halfHeight = chartHeight / 2;

		for(let r = 0; r < Math.max(halfWidth, halfHeight); r += gridSize) {
			for(let dx = -r; dx <= r; dx += gridSize) {
				for(let dy = -r; dy <= r; dy += gridSize) {
					if(Math.abs(dx) !== r && Math.abs(dy) !== r) continue;

					const x = centerX + dx - width / 2;
					const y = centerY + dy - height / 2;

					if(this.canPlace(x, y, width, height, chartWidth, chartHeight)) {
						return { x, y, width, height };
					}
				}
			}
		}

		return null;
	}

	/**
	 * 检查位置是否可用
	 */
	canPlace(x, y, width, height, chartWidth, chartHeight) {
		if(x < 0 || y < 0 || x + width > chartWidth || y + height > chartHeight) {
			return false;
		}

		for(const placed of this.placedWords) {
			if(!(x + width < placed.x || x > placed.x + placed.width ||
				 y + height < placed.y || y > placed.y + placed.height)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * 创建词语标签
	 */
	createWordLabel(text, x, y, fontSize, color, item) {
		const label = this.graph.createShape('label', {
			style: {
				fill: color,
				font: `${fontSize}px Arial`,
				textAlign: 'left',
				textBaseline: 'top',
				zIndex: 1
			},
			text: text,
			position: { x, y },
			data: item
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
		
		const shape = this.graph.createShape('label', {
			style: style,
			text: 'Aa',
			position: { x: 0, y: 0 }
		});
		
		this.graph.legend.append(this, shape);
	}
}

export { jmWordCloudSeries };
