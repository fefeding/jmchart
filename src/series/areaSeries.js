import jmLineSeries from './lineSeries.js';

/**
 * 面积图
 * 继承自折线图，默认启用区域填充
 *
 * @class jmAreaSeries
 * @module jmChart
 * @extends jmLineSeries
 */
export default class jmAreaSeries extends jmLineSeries {
	constructor(options) {
		options.style = options.style || options.graph.style.area;
		super(options);
		// 面积图默认显示面积填充
		this.style.area = true;
	}

	/**
	 * 生成图例
	 */
	createLegend() {
		const style = this.graph.utils.clone(this.style);
		style.stroke = style.color;
		style.fill = style.color;
		const shape = this.graph.createShape('path',{style:style});

		if(this.curve || this.style.curve) {
			const p1 = {x:0,y: this.graph.style.legend.item.shape.height};
			const p2 = {x:this.graph.style.legend.item.shape.width / 3,y:this.graph.style.legend.item.shape.height/3};
			const p3 = {x:this.graph.style.legend.item.shape.width / 3 * 2,y:this.graph.style.legend.item.shape.height/3*2};
			const p4 = {x:this.graph.style.legend.item.shape.width,y:0};

			this.__bezier = this.__bezier || this.graph.createShape('bezier');
			this.__bezier.cpoints = [
				p1,p2,p3,p4
			];

			shape.points = this.__bezier.initPoints();
		}
		else {
			shape.points = [{
				x:0,y: this.graph.style.legend.item.shape.height/2
			},{
				x: this.graph.style.legend.item.shape.width,y: this.graph.style.legend.item.shape.height/2
			}];
		}
		this.graph.legend.append(this, shape);
	}
}
