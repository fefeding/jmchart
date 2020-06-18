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
        if(!this.visible) return;
        
        // 纵标线，中间标小圆圈
        if(this.markLineType === 'y') {
            // 重置所有图形
            var shape;
            while(shape = this.shapes.shift()) {
                shape && shape.remove();
            }

            const touchPoints = []; // 命中的数据点
            const graph = this.graph;
            let touchChange = false;

            // 根据线条数生成标点个数
            for(let serie of graph.series) {
                // 得有数据描点的才展示圆
                if(!serie.getDataPointByX) continue; 

                const point = serie.getDataPointByX(this.start.x); // 找到最近的数据点
                if(!point) continue;

                const style = graph.utils.clone(this.style, {
                    stroke: serie.style.color || serie.style.stroke                    
                }, true);
                this.markArc = graph.createShape(jmArc, {
                    style,
                    radius: this.style.radius || 5
                });

                this.markArc.center.y = point.y;

                this.children.add(this.markArc);
                this.shapes.add(this.markArc);

                // x轴改变，表示变换了位置
                if(!touchChange && (!serie.lastMarkPoint || serie.lastMarkPoint.x != point.x)) touchChange = true;

                this.start.x = this.end.x = point.x;

                touchPoints.push(point);
                serie.lastMarkPoint = point;// 记下最后一次改变的点
            }

            // 触发touch数据点改变事件
            touchChange && setTimeout(()=>{
                    graph.emit('touchPointChange', {
                        points: touchPoints
                    });
                }, 10);
        }
    }

    /**
	 * 移动标线
	 * @param { object } args 移动事件参数
	 */
	move(args) {
        // 事件是挂在graph下的，，但此轴是放在chartArea中的。所以事件判断用graph坐标，但是当前位置要相对于chartArea
		
		if(this.visible && this.markLineType === 'x') {
			if(args.position.y <= this.graph.chartArea.position.y) {
				this.start.y = this.end.y = 0;
			}
			else if(args.position.y > this.graph.chartArea.height + this.graph.chartArea.position.y) {
				this.start.y = this.end.y = this.graph.chartArea.height;
			}
			else {
				this.start.y = this.end.y = args.position.y - this.graph.chartArea.position.y;
			}
			this.start.x = 0;
			this.end.x = this.graph.chartArea.width;

			this.needUpdate = true;
		}

		if(this.visible && this.markLineType === 'y') {

			if(args.position.x < this.graph.chartArea.position.x) {
				this.start.x = this.end.x = 0;
			}
			else if(args.position.x > this.graph.chartArea.width + this.graph.chartArea.position.x) {
				this.start.x = this.end.x = this.graph.chartArea.width;
			}
			else {
				this.start.x = this.end.x = args.position.x - this.graph.chartArea.position.x;
			}
			this.start.y = 0;
			this.end.y = this.graph.chartArea.height;

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
	


