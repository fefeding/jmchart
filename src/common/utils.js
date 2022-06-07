
export default {    

    /**
     * 对比二个数组数据是否改变
     * @param {Array} source 被对比的数、组
     * @param {Array} target 对比数组
     * @param {Function} compare 比较函数
     */
    arrayIsChange(source, target, compare) {
        if(!source || !target) return true;
        if(source.length !== target.length) return true;

        if(typeof compare === 'function') {
            for(let i=0; i<source.length; i++) {
                if(!compare(source[i], target[i])) return true;
            }
            return false;
        }
        else return source == target;
    },

    /**
     * 复制一个对象
     * 
     * @method clone
     * @static
     * @param {object} source 被复制的对象
     * @param {object} target 可选，如果指定就表示复制给这个对象，如果为boolean它就是deep参数
     * @param {boolean} deep 是否深度复制，如果为true,数组内的每个对象都会被复制
     * @param {function} copyHandler 复制对象回调，如果返回undefined，就走后面的逻辑，否则到这里中止
     * @return {object} 参数source的拷贝对象
     */
     clone(source, target, deep = false, copyHandler = null, deepIndex = 0) {
        // 如果有指定回调，则用回调处理，否则走后面的复制逻辑
        if(typeof copyHandler === 'function') {
            const obj = copyHandler(source, deep, deepIndex);
            if(obj) return obj;
        }
        deepIndex++; // 每执行一次，需要判断最大拷贝深度        

        if(typeof target === 'boolean') {
            deep = target;
            target = undefined;
        }

        // 超过100拷贝深度，直接返回
        if(deepIndex > 100) {
            return target;
        }

        if(source && typeof source === 'object') {
            target = target || {};

            if(Array.isArray(source)) {
                //如果是深度复，则拷贝每个对象
                if(deep) {
                    let dest = [];
                    for(let i=0; i<source.length; i++) {
                        dest.push(this.clone(source[i], target[i], deep, copyHandler, deepIndex));
                    }
                    return dest;
                }
                return source.slice(0);
            }
           
            if(source.__proto__) target.__proto__ = source.__proto__;
            
            for(let k in source) {
                if(k === 'constructor') continue;
                // 如果不是对象和空，则采用target的属性
                if(typeof target[k] === 'object' || typeof target[k] === 'undefined') {                    
                    target[k] = this.clone(source[k], target[k], deep, copyHandler, deepIndex);
                }
            } 
            return target;
        }
        else if(typeof target != 'undefined') {
            return target;
        }

        return source;
    }  
}