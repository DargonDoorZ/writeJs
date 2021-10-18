/**
 * @title 发布订阅模式
*/

// 自定义一个公司对象
let cock = {}
// 换成对象类型的缓存列表
cock.list = {}

cock.on = function (key, fn) {
    // 如果对象中没有对应的key值
    // 也就是说明没有订阅过
    // 那就给key创建个缓存列表
    if (!this.list[key]) {
        this.list[key] = []
    }
    this.list[key].push(fn)
}

cock.emit = function () {
    // 第一个参数是对应的key值
    // 直接用数组的shift方法取出 (把类数组对象转为数组对象，删除并拿到arguments的第一项)
    let key = [].shift.call(arguments)
    fns = this.list[key];
    // 如果缓存列表里没有函数返回false
    if (!fns || fns.length === 0) {
        return fns
    }
    // 遍历key值对应的缓存列表
    // 依次执行函数的方法
    fns.forEach(fn => {
        fn.apply(this, arguments)
    })
}

var out = 2

async function test(){
    console.log(out)
    out = await new Promise((res,rej)=>{
        setTimeout(()=>{
            res(1)
        },3000)
    })
    console.log('1111', out)
}

test()