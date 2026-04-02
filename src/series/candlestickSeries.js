import jmSeries from './series.js';

/**
 * K线图（蜡烛图）
 * 
 * K线图是金融领域常用的图表类型，用于显示股票、期货等金融产品的价格走势。
 * 每根K线包含四个价格：开盘价、收盘价、最高价、最低价。
 * 
 * 数据格式要求：
 * - fields: ['open', 'close', 'high', 'low']
 * - open: 开盘价
 * - close: 收盘价
 * - high: 最高价
 * - low: 最低价
 * 
 * 样式配置：
 * - masculineColor: 阳线颜色（收盘价 > 开盘价），默认红色
 * - negativeColor: 阴线颜色（收盘价 < 开盘价），默认绿色
 * - barWidth: K线宽度（像素）
 * - perWidth: K线宽度占比（0-1），默认0.4
 *
 * @class jmCandlestickSeries
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {array} mappings 图形字段映射
 * @param {style} style 样式
 */

export default class jmCandlestickSeries extends jmSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.candlestick || options.graph.style.line;
		super(options);
	}

	/**
	 * 初始化K线图
	 * 
	 * 绘制逻辑：
	 * 1. 遍历所有数据点
	 * 2. 判断阳线或阴线
	 * 3. 绘制K线实体和上下影线
	 */
	init() {
		const { points } = this.initDataPoint();	

		const len = points.length;
		if(!len) return;
		
		this.initWidth(len);

		const w = this.barWidth / 2;

		for(let i = 0; i < len; i++) {
			const p = points[i];
			
			if(typeof p.y === 'undefined' || p.y === null) {
				continue;
			}

			if(!p.points || p.points.length < 4) {
				console.warn('K线图数据不完整，需要4个字段（开盘、收盘、最高、最低）');
				continue;
			}

			const bl = {
				x: p.x - w,
				y: p.points[0].y
			};
			const br = {
				x: p.x + w,
				y: p.points[0].y
			};
			const tl = {
				x: p.x - w,
				y: p.points[1].y
			};
			const tr = {
				x: p.x + w,
				y: p.points[1].y
			};

			let tm = p.points[1];
			let bm = p.points[0];
			
			// 使用浅拷贝避免污染共享引用
			const style = Object.assign({}, p.style);
			style.stroke = style.fill = style.masculineColor || 'red';

			if(p.points[0].yValue > p.points[1].yValue) {
				style.stroke = style.fill = style.negativeColor || 'green';
				bl.y = br.y = p.points[1].y;
				tl.y = tr.y = p.points[0].y;

				tm = p.points[0];
				bm = p.points[1];
			}			

			const sp = this.addShape(this.graph.createPath([], style));
			sp.points.push(p.points[2], tm, tl, bl, bm, p.points[3], bm, br, tr, tm, p.points[2]);

			this.emit('onPointCreated', p);
		}
	}

	/**
	 * 计算K线宽度
	 * 
	 * @param {number} count 数据点数量
	 */
	initWidth(count) {
		const maxWidth = this.xAxis.width / count;

		if(this.style.barWidth > 0) {
			this.barWidth = Number(this.style.barWidth);
		}
		else {
			this.barWidth = maxWidth * (this.style.perWidth||0.4);
		}
		
		if(this.barWidth > maxWidth) {
			this.barWidth = maxWidth;
			this.barTotalWidth = maxWidth * count;
		}
	}
}
