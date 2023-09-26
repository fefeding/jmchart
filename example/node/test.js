const fs = require('fs');
const {jmChart} = require("../../dist/jmchart.cjs.js");
const { createCanvas, Image, registerFont } = require('canvas');
registerFont('msyh.ttf', { family: '微软雅黑' });

const mycanvas = createCanvas(800, 600);

inichart(800, 600);

saveToImage();

// 导出为图片
function saveToImage() {
    const out = fs.createWriteStream(__dirname + '/test.png');
    const stream = mycanvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () =>  console.log('The PNG file was created.'));
}

function inichart(w, h) {
    var chart = new jmChart(mycanvas, {
        width: w,
        height: h,
        xField: 'x',
        //baseY: 0,
        // 最大和最小X值，  这里一般不用指定，除非硬是需要
        minXValue : 0,
        maxXValue : 10,
        minYValue: -100,
        maxYValue: 400,
        // node下这二项得为false
        enableAnimate: false,
        autoRefresh: false,
        yLabelFormat: (value, shape)=>{
            return value + '%';
        },
        xLabelFormat: (value, data, index)=>{
            if(index % 5 === 0) return value + 'x';
            return '';
        },
        style: {
            margin: {
                left: 80
            },
            legend: {
                legendPosition: 'top',
                item: {
                    label: {
                        font: '12px "微软雅黑"', // 中文
                    }
                }
            },
            axis: {
                yLabel: {
                    margin: {
                        left: 30
                    }
                }
            }
        }
    });
    //chart.legend.legendPosition = 'top';
    chart.legend.visible = true;

    // touch改变数据点事件
    chart.on('touchPointChange', function(args) {
        console.log(args);
    });

    // 滑动标线，阻止默认事件
    chart.on('marklinemove', (args)=>{
        args.event.preventDefault();// 阻止默认行为		
        args.event.stopPropagation();	
    });

    var line1 = chart.createSeries('line', {
        field: 'y1',
        //index: 2, // 指定Y轴索引，如是档指定就会共用左边的Y轴，
        // 最大值和最小值，如果不指定会自动计算，
        // 如果指定了也只是指定了最大或最小边界，如果有数值超过它，依然以事实数值为准
        minYValue: 0,
        maxYValue: 200 ,
        style: {
            // 画圆滑的曲线 , 否则就是折线
            curve: true,// 填充图形
            label: {
                show: true
            },
            color: 'blue',
            area: {
                // 自定义填充颜色处理
                fill: function(style) {
                    // 根据颜色生成渐变效果
                    const color = this.graph.utils.hexToRGBA(this.style.stroke);
                    return `linear-gradient(50% 0 50% 100%, 
                        rgba(${color.r},${color.g},${color.b}, 0) 1, 
                        rgba(${color.r},${color.g},${color.b}, 0) 0.8,
                        rgba(${color.r},${color.g},${color.b}, 0.3) 0.5,
                        rgba(${color.r},${color.g},${color.b}, 0.5) 0.2, 
                        rgba(${color.r},${color.g},${color.b}, 0.8) 0)`;
                }
            }
        },
        itemLabelFormat: function(p) {
            return p.yValue.toFixed(0);
        },
        legendFormat: function(options) {
            return '图例2';
        },
        // 生成点的回调
        onPointCreated(point) {
            //console.log('onPointCreated', point);
            if(point.data.x === 10) {
                addPointMarkLabel.call(this, point);
            }
        }
    });		
    
    

    var line2 = chart.createSeries('line', {
        field: 'y2',
        legendLabel: '图例3',
        style: {
            showItem: false
        }
    });	

    var line3 = chart.createSeries('line', {
        field: 'y8',
        legendLabel: '图例8',
        style: {
            showItem: false,
            lineWidth: 3,
            //curve: true,
            lineType: 'dotted', // 虚线
            shadow: function() {								
                return `2, 2, 10, ${this.style.stroke}`;
            },
        }
    });	
    var line4 = chart.createSeries('line', {
        field: 'y9',
        legendLabel: '图例9',
        style: {
            showItem: false,
            lineWidth: 3,
            shadow: function() {								
                return `2, 2, 10, ${this.style.stroke}`;
            },
            area: {
                // 自定义填充颜色处理
                fill: function(style) {
                    // 根据颜色生成渐变效果
                    const color = this.graph.utils.hexToRGBA(this.style.stroke);
                    return `linear-gradient(50% 0 50% 100%, 
                        rgba(${color.r},${color.g},${color.b}, 0) 1, 
                        rgba(${color.r},${color.g},${color.b}, 0) 0.8,
                        rgba(${color.r},${color.g},${color.b}, 0.3) 0.5,
                        rgba(${color.r},${color.g},${color.b}, 0.5) 0.2, 
                        rgba(${color.r},${color.g},${color.b}, 0.8) 0)`;
                }
            }
        }
    });	
    var line5 = chart.createSeries('line', {
        field: 'y10',
        legendLabel: '图例10',
        style: {
            showItem: false,
            lineWidth: 3,
            lineType: 'dotted', // 虚线
            shadow: function() {								
                return `2, 2, 10, ${this.style.stroke}`;
            },
        }
    });	

    const datacount = 50;
    
    chart.data = [];
    for(var i = 0;i<datacount;i++) {
        var data = {
            x : i,
            y1 :  Math.random() * 200 - 100,
            y2: Math.random() * 200 + 50,
            y3: Math.random() * 200 + 50,
            y4:Math.random() * 200 + 50,
            y5:Math.random() * 200 + 50,
            y6:Math.random() * 200 + 50,
            y7:i,
            y8: i * 6 + Math.random(),
            y9: i * 3 + Math.random(),
            y10:  -i + Math.random()
        };
        if(i == 3) {
            data.y = null;
        }
        chart.data.push(data);
    }

    chart.refresh();    
   
}

// 创建点的标注
function addPointMarkLabel(point) {
    const w = 40;
    const h = 20;
    const bottom = 20;
    const arrowOffset = 10;

    // 标注图形左上角
    const p1 = {
                x: point.x - w / 2,
                y: point.y - bottom - h
            };
    const p2 = {
                x: p1.x,
                y: p1.y + h
            };
    const p3 = {
                x: p2.x + w,
                y: p2.y
            };
    const p4 = {
                x: p3.x,
                y: p1.y
            };
    
    const labelPath = this.graph.createShape('path', {
        style: {
            stroke: 'red',
            fill: '#55cccccc',
            zIndex: 18,
            close: true
        },
        points: [
            p1,
            p2,
            {
                x: point.x - arrowOffset / 2,
                y: p2.y
            },
            {
                x: point.x,
                y: p2.y + arrowOffset
            },
            {
                x: point.x + arrowOffset / 2,
                y: p2.y
            },
            p3,
            p4
        ]
    });
    const label = this.graph.createShape('label', {
        style: {
            textAlign: 'center',
            textBaseline: 'middle',
            fill: 'red',
            font: '12px "微软雅黑"', // 中文
        },
        center: {
            x: w / 2,
            y: h / 2 + 2
        },
        text: '买入'
    });
    labelPath.children.add(label);
    this.addShape(labelPath);
}