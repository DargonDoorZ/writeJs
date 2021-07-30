/**
 * 判断数组的几种方式?
 */
const UDD = []
const ex = Object.prototype.toString.call(UDD).slice(8, -1) === 'Array'
const ex1 = UDD.__proto__ === Array.prototype
const ex2 = Array.isArray(UDD)
const ex3 = UDD instanceof Array
const ex4 = Array.prototype.isPrototypeOf(UDD)

console.log(ex, ex1, ex2, ex3, ex4)


/**
 * 手写:reduce 实现 map
 */
Array.prototype.Mmap = function (fn, thisArg) {
    const result = [];
    this.reduce((prev, curr, index, array) => {
        result[index] = fn.call(thisArg, array[index], index, array);
    }, 0);
    return result;
};
