
/**
 * 基础样式
 *
 * @class jmChartStyle
 * @module jmChart
 * @static
 */
export default {	
	margin:{
		left: 60,
		top: 20,
		right: 40,
		bottom: 60
	},
	legend: {		
		stroke: 'transparent',		
		lineWidth: 0,
		margin: {
			left:20,
			top:10,
			right:20,
			bottom:20
		},
		width: 200,
		height: 0,		
		item: {
			shape: {
				width:20,
				height:15
			},
			label: {
				textAlign: 'left',
				textBaseline: 'middle',
				font: '12px Arial',
				fill: '#000'
			},
			normal: {
				fill: 'transparent',
				cursor: 'default'
			},
			hover: {
				fill: '#ccc',
				cursor: 'pointer'
			}
		}
	},
	chartArea: {
		layout: 'normal',		
		stroke: 'rgb(229,229,229)',
		margin:{
			left:60,
			top:20,
			right:40,
			bottom:40
		}
	},
	axis: {
		stroke:'#05468E',
		lineWidth:1,
		zIndex:20,
		xLabel : {
			count: 10,
			length: 5,
			fill: '#000',
			stroke: 'red',
			margin: {left:0,top:10,right:6,bottom:0},
			textAlign: 'center',
			textBaseline: 'top',
			font: '12px Arial',
			zIndex:20,
			// 旋转角度
			rotation: {
				angle: 0,
				point : { x: 0, y: 0 }
			}
		},
		yLabel : {
			count: 10,
			length: 5,
			fill: '#000',			
			margin: {left:6,top:6,right:6,bottom:0},
			textAlign: 'center',
			textBaseline: 'middle',
			font: '12px Arial',
			zIndex:20,
			// 旋转角度
			rotation: {
				angle: 0,
				point : { x: 0, y: 0 }
			}
		}
	},
	chartColors : ['#249FDA','#EA3B7C','#8EBC00','#309B46','#4B507E','#D8E404','#EB792A','#A00DA0'],
	tooltip: {
		'background-color': 'rgb(255,255,255)',
		'padding':'4px',
		'opacity':'0.8',
		'border':'1px solid #000',
		'box-shadow': '0 0 3px #000',
		'border-radius': '6px'
	},
	line : {
		normal: {
			lineWidth:1.5,
			zIndex: 18,
			cursor: 'default'
		},
		hover: {
			lineWidth:4,
			//zIndex: 100,
			cursor: 'pointer'
		},
		lineWidth:1.5,
		zIndex: 18,
		cursor: 'default',
		radius: 3,
		fill: null,		
		item: {
			fill: '#fff',
			zIndex: 19
		}
	},
	bar : {
		normal: {
			lineWidth:1.5,
			zIndex: 17,
			cursor: 'default',
			opacity: 0.8
		},
		hover: {
			lineWidth:4,
			//zIndex: 100,
			opacity: 1,
			cursor: 'pointer'
		},
		lineWidth:1.5,
		zIndex: 17,
		cursor: 'default',
		close : true,
		opacity: 0.8,
		shadow: {
			x: 1,
			y: 1,
			blur: 2,
			color: '#000'
		}
	},
	pie: {
		normal: {
			zIndex: 11,
			cursor: 'default',
			opacity: 0.8
		},
		hover: {
			//zIndex: 100,
			opacity: 1,
			cursor: 'pointer'
		},
		margin: {
			left: 10,
			top: 10,
			right: 10,
			bottom: 10
		},
		lineWidth:1,
		zIndex: 11,
		cursor: 'default',
		close : true,
		opacity: 0.8,
		shadow: {
			x: 1,
			y: 1,
			blur: 5,
			color: '#000'
		}
	}
}