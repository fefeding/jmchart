
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

function jmAxis(chart,type,dataType,style) {
	/**
	 * 轴类型(x/y/radar),默认为x
	 *
	 * @property type
	 * @type string
	 */
	this.type = type || 'x';

	/**
	 * 当前轴的数据类型(number/date/string),默认为 number
	 *
	 * @property type
	 * @type string
	 */
	this.dataType = dataType || 'number';


	/**
	 * 轴样式，默认为jmChartStyle中的配置
	 *
	 * @property type
	 * @type object
	 */
	this.style = style || chart.style.axis;

	/**
	 * 当前轴所在的图表
	 *
	 * @property chart
	 * @type jmChart
	 */
	this.chart = chart;

	/**
	 * 轴的起始坐标
	 *
	 * @property start
	 * @type point
	 */
	this.start = {x:0,y:0};

	/**
	 * 轴标签起始坐标
	 *
	 * @property labelStart
	 * @type number
	 */
	this.labelStart = 0;

	/**
	 * 轴的结束坐标
	 *
	 * @property end
	 * @type point
	 */
	this.end = {x:0,y:0};

	/**
	 * 是否从0开始
	 *
	 * @property type
	 * @type bool
	 * @for jmAxis
	 */
	this.zeroBase = false;

	/**
	 * 显示标签个数
	 *
	 * @property labelCount
	 * @type number
	 * @for jmAxis
	 */
	this.labelCount = 1;

	/**
	 * 当前轴所关联的分类数据
	 * 主要用于字符串分类
	 *
	 * @property values
	 * @type array
	 * @for jmAxis
	 */
	this.values = [];

	/**
	 * 初始化轴图形
	 *
	 * @method init
	 */
	this._init = function() {
		if(!this.shape) {
			this.shape = this.chart.graph.createShape('path',this);
			this.arraw(false);
			this.chart.chartArea.children.add(this.shape);
		}
	}

	/**
	 * 计算当前轴的位置
	 * 
	 * @method reset
	 */
	this.reset = function() {		
		switch(this.type) {
			case 'x' : {	
				//初始化显示标签个数
				this.labelCount = this.style.yLabel.count || 10;
				this.start.x = 0;
				this.start.y = this.chart.chartArea.height();
				this.end.x = this.chart.chartArea.width();
				this.end.y = this.start.y;					
				break;
			}
			case 'y' : {
				var index = this.index || 1;					
				var xoffset = 0;
				
				//多Y轴时，第二个为右边第一轴，其它的依此递推
				if(index == 2) {
					xoffset = this.chart.xAxis.start.x + this.chart.xAxis.width();
				}
				else if(index > 2) {
					xoffset = this.chart.yAxises[index-1].start.x + this.chart.yAxises[index-1].width() + 10;
				}
					
				
				this.start.x = xoffset;
				this.start.y = this.chart.chartArea.height();
				this.end.x = this.start.x;
				this.end.y = 0;

				//当Y轴最小值为负数时，则移动X轴的位置到0位置
				var min = this.min();
				var max = this.max();
				if(this.dataType == 'number' && min < 0 && this.chart.xAxis) {
					var step = this.step();
					var xstepy = 0;//x轴y偏移量
					if(max <= 0) {
						this.chart.xAxis.value = max;
						xstepy = this.end.y;
					}
					else {
						this.chart.xAxis.value = min;
						xstepy = this.start.y + (step * min);
					}
					this.chart.xAxis.start.y = this.chart.xAxis.end.y = xstepy;
				}

				//当X轴最小值为负数时，则移动第一个Y轴至0位置	
				if(index == 1) {
					var minX = this.chart.xAxis.min();
					var maxX = this.chart.xAxis.max();
					if(this.chart.xAxis.dataType == 'number' && minX < 0) {
						var stepX = this.chart.xAxis.step();
						var ystepx = 0;//y轴x偏移量
						if(max <= 0) {
							this.value = max;
							ystepx = this.chart.xAxis.end.x;
						}
						//当X轴最大值大于0，但最小值小于0时，Y轴位于中间位
						else {
							this.value = min;
							ystepx = -stepX * minX;
						}
						this.start.x = this.end.x = ystepx;
					}
				}
				break;
			}
		}
	}

	/**
	 * 生成轴标签
	 *
	 * @method createLabel
	 */
	this.createLabel = function() {
		if(this.labels) {			
			//移除原有的标签 
			var len = this.labels.length;
			for(var i=0;i<len;i++) {
				this.labels[i].remove();
			}
		}
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
	this.createXLabel = function() {
		var max = this.max();
		var min = this.min();
		var step = this.step();
		if(this.dataType == 'number') {	
			var mm = max - min;
			if(mm <= 10) {
				this.labelCount = mm;
			}

			//计算每个刻度点数值
			var pervalue = (mm / this.labelCount) || 1;
			if(pervalue > 1 || pervalue < -1) pervalue = Math.floor(pervalue);
			else pervalue = Number(pervalue.toFixed(2));

			var top = this.start.y + this.style.xLabel.margin.top;
			for(var p =min;p <= max;p += pervalue) {
				var v = p;
				var w = (v - min) * step;
				var label = this.chart.graph.createShape('label',{style:this.style.xLabel});
				label.value = v;					
				this.labels.push(label);
				this.chart.chartArea.children.add(label);
				label.width(label.width());
				label.height(15);
				var pos = {x: this.start.x + this.labelStart + w , y: top};

				//上一个标签位
				var preLabel = this.labels.length>1?this.labels[this.labels.length - 2]:null;
				//如果当前标签跟上一个标签重合，则不显示当前标签
				if(!preLabel || !preLabel.visible || preLabel.position().x + preLabel.width() < pos.x - 2) {
					//在轴上画小标记m表示移至当前点开画
					this.shape.points.push({
						x:pos.x,
						y:this.start.y,
						m:true
					});
					this.shape.points.push({
						x:pos.x,
						y:this.start.y + (this.style.length || 5)
					});					
				}
				else {
					label.visible = false;
				}

				//如果进行了旋转，则处理位移
				var rotate = label.rotate || label.style.rotate;
				if(rotate && label.mode == 'canvas') {	
					//设定旋转原点为label左上角					
					label.rotatePosition = pos;
					//当旋转后，其原点位移至左上角，所有当前控件必须反向移位其父容器位置
					label.position({x:-this.chart.chartArea.position().x,y:-this.chart.chartArea.position().y});
				}
				else {	
					pos.x -=  label.width() / 2;//向左偏移半个label宽度
					label.position(pos);
				}											
			}				
		}
		else {				
			//最多显示标签个数
			//var count = this.style.xLabel.count || this.values.length;	
			//字符串轴。则显示每个标签	
			var top = this.start.y + this.style.xLabel.margin.top;		
			for(var i=0; i< this.values.length;i++) {	
				var v = this.values[i]; 	
				var w = (this.dataType == 'date'?(v - min):i) * step;
				var label = this.chart.graph.createShape('label',{style:this.style.xLabel});
				label.value = this.dataType == 'date'?jmUtils.formatDate(v,this.format || 'yyyy-MM-dd HH:mm:ss'):v;
				this.labels.push(label);
				this.chart.chartArea.children.add(label);
				label.width(label.width() + 2);
				label.height(15);
				var pos = {x:this.start.x + this.labelStart + w,y:top};

				//上一个标签位
				var preLabel = this.labels.length>1?this.labels[this.labels.length - 2]:null;
				//如果当前标签跟上一个标签重合，则不显示当前标签
				if(!preLabel || !preLabel.visible || preLabel.position().x + preLabel.width() < pos.x - 2) {
					//在轴上画小标记m表示移至当前点开画
					this.shape.points.push({
						x:pos.x,
						y:this.start.y,
						m:true
					});
					this.shape.points.push({
						x:pos.x,
						y:this.start.y + (this.style.length || 5)
					});
				}
				else {
					label.visible = false;
				}
				//如果进行了旋转，则处理位移
				var rotate = label.rotate || label.style.rotate;
				if(rotate && label.mode == 'canvas') {
					//设定旋转原点为label左上角					
					label.rotatePosition = pos;
					//当旋转后，其原点位移至左上角，所有当前控件必须反向移位其父容器位置
					label.position({x:-this.chart.chartArea.position().x,y:-this.chart.chartArea.position().y});
				}
				else {
					pos.x -=  label.width() / 2;//向左偏移半个label宽度
					label.position(pos);
				}
			}						
		}
	}

	/**
	 * 生成Y轴标签
	 *
	 * @method createYLabel
	 * @private
	 */
	this.createYLabel = function() {
		var max = this.max();
		var min = this.min();
		var step = this.step();
		var index = this.index || 1;

		if(this.dataType == 'number') {
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
				var label = this.chart.graph.createShape('label',{style:this.style.yLabel});
				label.value = v;
				this.labels.push(label);
				this.chart.chartArea.children.add(label);

				var w = label.testSize().width;

				//计算标签位置
				if(index <= 1) {
					//轴的宽度
					var axiswidth = this.style.yLabel.margin.right + w + label.style.length;
					this.width(Math.max(axiswidth,this.width()));

					var pos = {x:this.start.x - axiswidth,
								y:this.start.y - h};
					//在轴上画小标记m表示移至当前点开画
					this.shape.points.push({
						x: this.start.x,
						y: pos.y,
						m: true
					});
					this.shape.points.push({
						x:this.start.x - label.style.length,
						y:pos.y
					});
				}
				else {
					//轴的宽度
					var axiswidth = this.style.yLabel.margin.left + w + label.style.length;
					this.width(Math.max(axiswidth,this.width()));

					var pos = {x:this.start.x + this.style.yLabel.margin.left + label.style.length,
								y:this.start.y - h};
					//在轴上画小标记m表示移至当前点开画
					this.shape.points.push({
						x: this.start.x,
						y: pos.y,
						m: true
					});
					this.shape.points.push({
						x:this.start.x + label.style.length,
						y:pos.y
					});
				}
				
				//如果进行了旋转，则处理位移
				var rotate = label.rotate || label.style.rotate;
				if(rotate && label.mode == 'canvas') {
					label.translate = pos;//先位移再旋转
					label.position({x:-w / 2,y:0});
				}
				else {							
					label.position(pos);
				}						
			}				
		}
		else {				
			//最多显示标签个数
			//var count = this.style.xLabel.count || this.values.length;	
			//字符串轴。则显示每个标签
			//var pstep = Math.ceil(max / 10) || 1;			
			for(var p =1;p <= max;p += 1) {				
				var h = (p - min) * step;
				var label = this.chart.graph.createShape('label',{style:this.style.yLabel});
				label.value = this.values[p];
				this.labels.push(label);
				this.chart.chartArea.children.add(label);

				var w = label.testSize().width;
				//计算标签位置
				if(index <= 1) {
					//轴的宽度
					var axiswidth = this.style.yLabel.margin.right + w + label.style.length;
					this.width(Math.max(axiswidth,this.width()));

					var pos = {x:this.start.x - axiswidth,
								y:this.start.y - h};
					//在轴上画小标记m表示移至当前点开画
					this.shape.points.push({
						x: this.start.x,
						y: pos.y,
						m: true
					});
					this.shape.points.push({
						x:this.start.x - label.style.length,
						y:pos.y
					});
				}
				else {
					//轴的宽度
					var axiswidth = this.style.yLabel.margin.left + w + label.style.length;
					this.width(Math.max(axiswidth,this.width()));

					var pos = {x:this.start.x + this.style.yLabel.margin.left + label.style.length,
								y:this.start.y - h};
					//在轴上画小标记m表示移至当前点开画
					this.shape.points.push({
						x: this.start.x,
						y: pos.y,
						m: true
					});
					this.shape.points.push({
						x:this.start.x + label.style.length,
						y:pos.y
					});
				}

				//如果进行了旋转，则处理位移
				var rotate = label.rotate || label.style.rotate;
				if(rotate && label.mode == 'canvas') {
					label.translate = pos;//先位移再旋转
					label.position({x:-w / 2,y:0});
				}
				else {							
					label.position(pos);
				}						
			}				
		}
	}

	/**
	 * 绘制当前轴
	 *
	 * @method draw
	 */
	this.draw = function() {			
		this.shape.style = this.style;
		this.shape.points = [this.start,this.end];
		//生成标签
		this.createLabel();
	}

	/**
	 * 显示当前轴
	 *
	 * @method show
	 */
	this.show = function() {
		this.shape.visible = true;
	}

	/**
	 * 隐藏当前轴
	 *
	 * @method hide
	 */
	this.hide = function() {
		this.shape.visible = false;
	}

	/**
	 * 设置是否显示箭头
	 *
	 * @method arraw
	 * @param {bool} v 是否显示
	 */
	this.arraw = function(v) {			
		this.shape.arrawVisible = v;
	}

	/**
	* 获取当前轴所占宽
	*
	* @method width
	*/
	this.width = function(w) {
		if(w) {
			this._width = w;
		}
		if(this._width) {
			return this._width;
		}
		return Math.abs(this.end.x - this.start.x);
	}

	/**
	* 获取当前轴所占高
	*
	* @method height
	*/
	this.height = function() {
		return Math.abs(this.end.y - this.start.y);
	}

	/**
	* 获取或设置当前轴最大值
	*
	* @method max
	* @param {number/date/string} 当前轴的最大值
	* @return 当前轴的最大值
	*/
	this.max = function(m) {
		if(typeof m !== 'undefined') {
			//如果为0为基线，则最小值不能大于0
			if(this.dataType == 'number' && m < 0 && this.zeroBase) {
				m = 0;
			}
			this._max = this._max != null && typeof(this._max) != 'undefined'?Math.max(m,this._max):m;						
		}	
		//如果为字符串，则返回分类个数
		if(this.dataType == 'string' && this.values) {
			return this.values.length;
		}	

		//如果是数字类型，则在最大值基础上加一定的值
		if(this.dataType == 'number') {
			var m = this._max;
			if(m <= 0) {
				if(m >= -10) m = 0;
				else m = -10;
			}
			else if(m > 500) {
				m = Math.floor(m / 100);
				m = m * 100 + 100;
			}
			else if(m > 100) {
				m = Math.floor(m / 50);
				m = m * 50 + 50;
			}
			else if(m > 10) {
				m = Math.floor(m / 10);
				m = m * 10 + 10;
			}
			else {
				m = Math.floor(m) + 1;
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
	this.min = function(m) {
		if(typeof m !== 'undefined') {
			//如果为0为基线，则最小值不能大于0
			if(this.dataType == 'number' && m > 0 && this.zeroBase) {
				m = 0;
			}
			this._min = this._min != null && typeof(this._min) != 'undefined'?Math.min(m,this._min):m;						
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
				m = Math.floor(m) - 1;
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
	this.clear = function() {
		this._min = null;
		this._max = null;
		this.values = [];
	}

	/**
	 * 计算当前轴的单位偏移量
	 *
	 * @method step
	 * @return {number} 单位偏移量
	 */
	this.step = function() {
		if(this.type == 'x') {
			var w = this.width();
			switch(this.dataType) {					
				case 'string': {
					//如果排版为内联，则单位占宽减少一个单位,
					//也就是起始位从一个单位开始
					if(this.chart.layout == 'inside') {
						var sp =  w / this.max();	
						this.labelStart = sp / 2;
						return sp;
					}			
					return w / (this.max() - 1);					
				}	
				case 'date': {
					var min = this.min();	
					var tmp = this.max() - min;					
					tmp = tmp || 1;	
					//如果排版为内联，则单位占宽减少一个单位,
					//也就是起始位从一个单位开始
					if(this.chart.layout == 'inside') {
						this.labelStart = w / this.labelCount / 2;
						w = w - w / this.labelCount;
					}						
					return w / tmp;
				}

				case 'number': 
				default: {
					var min = this.min();
					var tmp = Math.abs((this.max() - min));
					tmp = tmp || 1;	
					//如果排版为内联，则单位占宽减少一个单位,
					//也就是起始位从一个单位开始
					if(this.chart.layout == 'inside') {
						this.labelStart = w / this.labelCount / 2;
						w = w - w / this.labelCount;
					}					
					return w / tmp;
				}					
			}
		}		
		else if(this.type == 'y') {
			var h = this.height();
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

	//初始化
	this._init();
}
	


