import jmRangeSeries from './rangeSeries.js';

/**
 * 堆叠折线图（已废弃，请使用范围图）
 * 
 * @deprecated 此类已废弃，请使用 jmRangeSeries（范围图）代替
 * @class jmStackLineSeries
 * @module jmChart
 * @extends jmRangeSeries
 */

export default class jmStackLineSeries extends jmRangeSeries {
	constructor(options) {
		console.warn('jmStackLineSeries 已废弃，请使用 jmRangeSeries（范围图）代替');
		super(options);
	}
}
