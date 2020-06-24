import  jmArrawLine from 'jmgraph/src/shapes/jmArrawLine.js';
import  jmLabel from 'jmgraph/src/shapes/jmLabel.js';
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

export default class jmAxis extends jmArrawLine {
	constructor(options) {
		super(options);

		//初始化不显示箭头
		this.arrawVisible = !!options.arrawVisible;
		this.zeroBase = options.zeroBase || false;

		this.labelCount = options.labelCount || 1;
		this.type = options.type || 'x';// 为横轴x或纵轴y

		if(this.type == 'x') {
			this.dataType = options.dataType || 'string';
		}
		else {
			this.dataType = options.dataType || 'number';
		}

		this.field = options.field || '';
		this.index = options.index || 0;
		
		this.format = options.format || this.format;// 可以重写格式化label参数

		this.init(options);
	}

	// 初始化一些参数
	// 这个函数可能会重入。
	init(options) {
		options = options || {};
		// 深度组件默认样式
		if(options.style) this.graph.utils.clone(options.style, this.style, true);

		if(this.type == 'x') {
			if(typeof options.maxXValue !== 'undefined') this.maxValue = options.maxXValue; // 最大的值，如果指定了，则如果有数值比它大才会修改上限，否则以它为上限
			if(typeof options.minXValue !== 'undefined') this.minValue = options.minXValue;// 最小值，如果指定了，则轴的最小值为它或更小的值
		}
		else {
			if(typeof options.maxYValue !== 'undefined') this.maxValue = options.maxYValue; // 最大的值，如果指定了，则如果有数值比它大才会修改上限，否则以它为上限
			if(typeof options.minYValue !== 'undefined') this.minValue = options.minYValue;// 最小值，如果指定了，则轴的最小值为它或更小的值
		}
	}

	/**
	 * 轴类型(x/y/radar),默认为x
	 *
	 * @property type
	 * @type string
	 */
	type = 'x';
	
	/**
	 * 对应的字段
	 */
	field = '';

	/**
	 * 轴标签起始坐标
	 *
	 * @property labelStart
	 * @type number
	 */
	labelStart = 0;

	/**
	 * 否从0开始
	 *
	 * @property type
	 * @type bool
	 * @for jmAxis
	 */
	zeroBase = false;

	/**
	 * 显示标签个数
	 *
	 * @property labelCount
	 * @type number
	 * @for jmAxis
	 */
	labelCount = 1;

	/**
	 * 轴上的刻度，由动态计算出
	 */
	scalePoints = [];

	/**
	 * 关联访问的是chart的数据源
	 */
	get data() {
		return this.graph.data;
	}
	set data(d) {
		this.graph.data = d;
	}


	/**
	 * 计算当前轴的位置
	 * 
	 * @method reset
	 */
	reset() {	
		
		const bounds = this.graph.chartArea.getBounds();// 获取画图区域
		switch(this.type) {
			case 'x' : {	
				//初始化显示标签个数
				this.labelCount = this.style.yLabel.count || 10;
				this.start.x = bounds.left;
				this.start.y = bounds.bottom;
				this.end.x = bounds.right;
				this.end.y = bounds.bottom;					
				break;
			}
			case 'y' : {
				var index = this.index || 1;					
				var xoffset = bounds.left;
				
				//多Y轴时，第二个为右边第一轴，其它的依此递推
				if(index == 2) {
					xoffset = bounds.right;
				}
				else if(index > 2) {
					xoffset = this.graph.yAxises[index-1].start.x + this.graph.yAxises[index-1].width + 10;
				}					
				
				this.start.x = xoffset;
				this.start.y = bounds.bottom;
				this.end.x = this.start.x;
				this.end.y = bounds.top;

				//当Y轴最小值为负数时，则移动X轴的位置到0位置
				var min = this.min();
				var max = this.max();
				// zeroBase 时才需要移到0位置，否则依然为沉底
				if(this.dataType == 'number' && min < 0 && this.zeroBase && this.graph.xAxis) {
					var step = this.step();
					var xstepy = 0;//x轴y偏移量
					if(max <= 0) {
						this.graph.xAxis.value = max;
						xstepy = this.end.y;
					}
					else {
						this.graph.xAxis.value = min;
						xstepy = this.start.y + (step * min);
					}
					this.graph.xAxis.start.y = this.graph.xAxis.end.y = xstepy;
				}
				break;
			}
		}

		this.createLabel();
	}

	// 绘制完成后，生成label标签
	draw() {
		this.points.push(...this.scalePoints);// 把刻度也画出来
		super.draw();
	}

	/**
	 * 生成轴标签
	 *
	 * @method createLabel
	 */
	createLabel() {		
		//移除原有的标签 
		this.children.each(function(i, c) {
			c.remove();
		}, true);
		
		this.labels = [];
		//如果是？X轴则执行X轴标签生成
		if(this.type == 'x') {
			this.createXLabel();
		}
		else if(this.type == 'y') {
			this.createYLabel();
		}			
	}

	/**
	 * 生成X轴标签
	 *
	 * @method createXLabel
	 * @private
	 */
	createXLabel() {
		//var max = this.max();
		//var min = this.min();
		var step = this.step();
		this.scalePoints = [];// 刻度点集合
		//最多显示标签个数
		//var count = this.style.xLabel.count || this.data.length;	
		//字符串轴。则显示每个标签	
		var top = this.style.xLabel.margin.top || 0;		
		for(var i=0; i< this.data.length;i++) {	
			const d = this.data[i];
			const v = d[this.field]; 	
			
			var w = i * step;
			var label = this.graph.createShape(jmLabel, {
				style: this.style.xLabel
			});
			label.data = d; // 当前点的数据结构值

			if(typeof v === 'undefined') {
				label.visible = false;
			}

			label.text = this.format(v, d, i); // 格式化label

			this.labels.push(label);
			this.children.add(label);
			label.width =  label.testSize().width + 2;
			label.height = 15;

			const pos = {
				x: this.labelStart + w,
				y: top
			};

			// 指定要显示网格
			if(this.style.grid && this.style.grid.y) {
				// 它的坐标是相对于轴的，所以Y轴会用负的区域高度
				const line = this.graph.createShape(jmLine, {
					start: {
						x: pos.x,
						y: 0
					},
					end: {
						x: pos.x,
						y: -this.graph.chartArea.height
					},
					style: this.style.grid
				});
				this.children.add(line);
			}

			//在轴上画小标记m表示移至当前点开画
			this.scalePoints.push({
				x: pos.x + this.start.x,
				y: this.start.y,
				m: true
			});
			this.scalePoints.push({
				x: pos.x + this.start.x,
				y: this.start.y + (this.style.length || 5)
			});
			
			//如果进行了旋转，则处理位移
			var rotation = label.style.rotation;
			if(rotation && rotation.angle) {
				//设定旋转原点为label左上角					
				rotation.point = pos;
				//当旋转后，其原点位移至左上角，所有当前控件必须反向移位其父容器位置
				label.position = {x:-this.graph.chartArea.position.x,y:-this.graph.chartArea.position.y};
			}
			else {
				// 如果标签居中，则把二头的标签左边的左对齐，右边的右对齐
				if(this.style.align === 'center' && (
					i === 0 || (i === this.data.length - 1 && this.data.length > 1)
				)) {
					if(i === this.data.length - 1) {
						pos.x -= label.width;
					}
				}
				else {
					pos.x -=  label.width / 2;//向左偏移半个label宽度
				}
				label.position = pos;
			}
		}
	}

	/**
	 * 生成Y轴标签
	 *
	 * @method createYLabel
	 * @private
	 */
	createYLabel() {
		var max = this.max();
		var min = this.min();
		var step = this.step();
		var index = this.index || 1;
		this.scalePoints = [];// 刻度点集合

		var count = this.style.yLabel.count || 10;
		var mm = max - min;
		if(mm <= 10) {
			count = mm;
		}
		var pervalue = (mm / count) || 1;
		if(pervalue > 1 || pervalue < -1) pervalue = Math.floor(pervalue);
		else pervalue = Number(pervalue.toFixed(2));

		for(var p =min;p <= max;p += pervalue) {
			var v = p;
			var h = (v - min) * step;
			var label = this.graph.graph.createShape(jmLabel, {
				style: this.style.yLabel
			});
			label.text = this.format(v, label); // 格式化label
			this.labels.push(label);
			this.children.add(label);

			const w = label.testSize().width;
			const offy = this.height - h; // 刻度的偏移量

			//计算标签位置
			if(index <= 1) {
				//轴的宽度
				var axiswidth = this.style.yLabel.margin.right + w + label.style.length;
				this.width = Math.max(axiswidth, this.width);
				
				var pos = {
					x: -axiswidth,
					y: offy - label.height / 2
				};
				//在轴上画小标记m表示移至当前点开画
				this.scalePoints.push({
					x: this.start.x,
					y: offy + this.end.y ,
					m: true
				});
				this.scalePoints.push({
					x:this.start.x - label.style.length,
					y: offy + this.end.y
				});

				// 指定要显示网格
				if(this.style.grid && this.style.grid.x) {
					// 它的坐标是相对于轴的，所以Y轴会用负的区域高度
					const line = this.graph.createShape(jmLine, {
						start: {
							x: 0,
							y: offy
						},
						end: {
							x: this.graph.chartArea.width,
							y: offy
						},
						style: this.style.grid
					});
					this.children.add(line);
				}
			}
			else {
				//轴的宽度
				var axiswidth = this.style.yLabel.margin.left + w + label.style.length;
				this.width = Math.max(axiswidth, this.width);

				var pos = {
					x: this.style.yLabel.margin.left + label.style.length,
					y: offy - label.height / 2
				};
				//在轴上画小标记m表示移至当前点开画
				this.scalePoints.push({
					x: this.start.x,
					y: offy + this.end.y,
					m: true
				});
				this.scalePoints.push({
					x: this.start.x + label.style.length,
					y: offy + this.end.y
				});
			}
			
			//如果进行了旋转，则处理位移
			var rotation = label.style.rotation;
			if(rotation && rotation.angle) {
				label.translate = pos;//先位移再旋转
				label.position = {x: -w / 2, y: 0};
			}
			else {							
				label.position = pos;
			}	
		}
	}

	/**
	* 获取当前轴所占宽
	*
	* @method width
	*/
	get width() {		
		if(this._width) {
			return this._width;
		}
		return Math.abs(this.end.x - this.start.x);
	}
	set width(w) {
		this._width = w;
	}

	/**
	* 获取当前轴所占高
	*
	* @method height
	*/
	get height() {
		return Math.abs(this.end.y - this.start.y);
	}
	// 这里设置高度没意义
	set height(h) {}

	/**
	* 获取或设置当前轴最大值
	*
	* @method max
	* @param {number/date/string} 当前轴的最大值
	* @return 当前轴的最大值
	*/
	max(m) {
		if(typeof m !== 'undefined') {
			//如果为0为基线，则最小值不能大于0
			if(this.dataType == 'number' && m < 0 && this.zeroBase) {
				m = 0;
			}
			this._max = this._max != null && typeof(this._max) != 'undefined'? Math.max(m, this._max) : m;	
			// 如果有指定默认最大值，则不超过它就采用它
			if(typeof this.maxValue != 'undefined') this._max = Math.max(this.maxValue, this._max);					
		}	
		//如果为字符串，则返回分类个数
		if(this.dataType == 'string' && this.data) {
			return this.data.length;
		}	

		//如果是数字类型，则在最大值基础上加一定的值
		if(this.dataType == 'number') {
			var m = this._max;
			if(m <= 0) {
				if(m >= -10) m = 0;
				else m = -10;
			}
			else if(m > 500) {
				m = Math.ceil(m / 100);
				m = m * 100 + 100;
			}
			else if(m > 100) {
				m = Math.ceil(m / 50);
				m = m * 50 + 50;
			}
			else if(m > 10) {
				m = Math.ceil(m / 10);
				m = m * 10 + 10;
			}
			else {
				m = Math.ceil(m);
			}
			// 如果有指定默认最大值，则不超过它就采用它
			if(typeof this.maxValue != 'undefined')  {
				return Math.max(this.maxValue, m);
			}
			return m;
		}	

		return this._max;
	}

	/**
	* 获取或设置当前轴最小值
	*
	* @method max
	* @param {number/date/string} 当前轴的最小值
	* @return 当前轴的最小值
	*/
	min(m) {
		if(typeof m !== 'undefined') {
			//如果为0为基线，则最小值不能大于0
			if(this.dataType == 'number' && m > 0 && this.zeroBase) {
				m = 0;
			}
			this._min = this._min != null && typeof(this._min) != 'undefined'? Math.min(m, this._min) : m;	
			// 如果有指定默认最小值，则不小于它就采用它
			if(typeof this.minValue != 'undefined') this._min = Math.min(this.minValue, this._min);						
		}

		//如果是数字类型，则在最小值基础上减去一定的值
		if(this.dataType == 'number') {
			var m = this._min;
			if(m >= 0) {
				if(m <= 10) m = 0;
				else {
					m = Math.floor(m / 10) * 10 - 10;
				}
			}
			else if(m < -500) {
				m = Math.floor(m / 100);
				m = m * 100 - 100;
			}
			else if(m < -100) {
				m = Math.floor(m / 50);
				m = m * 50 - 50;
			}
			else if(m < -10) {
				m = Math.floor(m / 10);
				m = m * 10 - 10;
			}
			else {
				m = Math.floor(m);
			}
			// 如果有指定默认最小值，则不小于它就采用它
			if(typeof this.minValue != 'undefined')  {
				return Math.min(this.minValue, m);
			}
			return m;
		}
		//如果为字符串则返回0
		return this.dataType == 'string'?0:this._min;
	}

	/**
	 * 清除一些属性
	 *
	 * @method clear
	 */
	clear() {
		this._min = null;
		this._max = null;
	}

	/**
	 * 计算当前轴的单位偏移量
	 *
	 * @method step
	 * @return {number} 单位偏移量
	 */
	step() {
		if(this.type == 'x') {
			var w = this.width;

			//如果排版为内联，则单位占宽减少一个单位,
			//也就是起始位从一个单位开始
			if(this.graph.style.layout == 'inside') {
				var sp =  w / this.max();	
				this.labelStart = sp / 2;
				return sp;
			}	
			else {
				this.labelStart = 0;
			}		
			return w / (this.max() - 1);					
				
		}		
		else if(this.type == 'y') {
			var h = this.height;
			switch(this.dataType) {					
				case 'string': {
					return h / this.max();
				}
				case 'date':
				case 'number': 
				default: {
					var tmp = Math.abs(this.max() - this.min());
					tmp = tmp || 1;
					return h / tmp;
				}
			}
		}
	}
	// 格式化标签值
	format(v, item) {
		return v + '';
	}
}
	


