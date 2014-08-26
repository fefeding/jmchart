var fs = require('fs'); 
var jsp = require("../../nodejs/lib/uglify-js/uglify-js").parser; 
var pro = require("../../nodejs/lib/uglify-js/uglify-js").uglify; 

function build(files, fileOut) { 
	var code = '';
	for(var i=0;i<files.length;i++) {
		var origCode = fs.readFileSync(files[i], 'utf8'); 
		code += origCode;
	}
	
	var ast = jsp.parse(code); 
	ast = pro.ast_mangle(ast); 
	ast = pro.ast_squeeze(ast);
	var mincode = pro.gen_code(ast); 
	fs.writeFileSync(fileOut + '.min.js', mincode, 'utf8'); 
	fs.writeFileSync(fileOut + '.debug.js', code, 'utf8'); 
	console.log('build to ' +fileOut + ' complete');
}

var base = './src/';
var js = [
			base + '../../jmgraph/src/jmgraph.debug.js',
			base + 'common/style.js',
			base + 'axis/axis.js',
            base + 'legend/legend.js',
            base + 'series/series.js',
			base + 'series/lineSeries.js',
			base + 'series/barSeries.js',
			base + 'series/pieSeries.js',			
			base + 'jmChart.js'
			]; 

require('../jmgraph/build.js');//先合并压缩jmgraph
build(js,'./src/jmchart');