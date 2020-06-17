import { jmList } from 'jmgraph/src/core/jmGraph.js';
import  jmArc from 'jmgraph/src/shapes/jmArc.js';
import  jmLine from 'jmgraph/src/shapes/jmLine.js';

/**
 * 轴
 *
 * @class jmAxis
 * @module jmChart
 * @param {jmChart} chart 当前图表
 * @param {string} [type] 轴类型(x/y/radar),默认为x
 * @param {string} [dataType] 当前轴的数据类型(number/date/string),默认为 number
 * @param {object} [style] 样式
 */

export default class jmMarkLine extends jmLine {
	constructor(options) {

        super(options);
        
        this.visible = false;

        this.markLineType = options.type || 'x';// 为横轴x或纵轴y  
        
        /**
        * 当前图形下的所有子图
        */
       this.shapes = new jmList();
    }
    
    // 初始化轴
    init() {
        // 纵标线，中间标小圆圈
        if(this.markLineType === 'y') {
            // 重置所有图形
            var shape;
            while(shape = this.shapes.shift()) {
                shape && shape.remove();
            }

            this.markArc = this.graph.createShape(jmArc, {
                style: this.style,
                radius: this.style.radius || 5
            });
            this.children.add(this.markArc);
            this.shapes.add(this.markArc);
        }
    }

    /**
	 * 移动标线
	 * @param { object } args 移动事件参数
	 */
	move(args) {
		const maxY = this.graph.chartArea.height + this.graph.chartArea.position.y;
		const maxX = this.graph.chartArea.position.x + this.graph.chartArea.width;

		if(this.visible && this.markLineType === 'x') {
			if(args.position.y < this.graph.chartArea.position.y) {
				this.start.y = this.end.y = this.graph.chartArea.position.y;
			}
			else if(args.position.y > maxY) {
				this.start.y = this.end.y = maxY;
			}
			else {
				this.start.y = this.end.y = args.position.y;
			}
			this.start.x = this.graph.chartArea.position.x;
			this.end.x = this.graph.chartArea.position.x + this.graph.chartArea.width;

			this.needUpdate = true;
		}

		if(this.visible && this.markLineType === 'y') {

			if(args.position.x < this.graph.chartArea.position.x) {
				this.start.x = this.end.x = this.graph.chartArea.position.x;
			}
			else if(args.position.x > maxX) {
				this.start.x = this.end.x = maxX;
			}
			else {
				this.start.x = this.end.x = args.position.x;
			}
			this.start.y = this.graph.chartArea.position.y;
			this.end.y = this.graph.chartArea.position.y + this.graph.chartArea.height;

			this.needUpdate = true;
		}
    }
    
    /**
     * 中止
     */
    cancel() {
        this.visible = false;
        this.needUpdate = true;
    }
}
	


