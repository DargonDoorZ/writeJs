const arr = [1, 1, 2, 34, 5]

//数组去重
const fn1 = () => {
    let result = []
    arr.forEach(item => {
        if (!result.includes(item)) {
            result.push(item)
        }
    })
    return result
}

const fn2 = () => {
    return new Set(arr)
}

const fn3 = () => {
    let result = []
    arr.forEach(item => {
        if (result.indexOf(item) == -1) {
            result.push(item)
        }
    })
    return result
}

const fn4 = () => {
    return arr.filter((item, index) => {
        return arr.indexOf(item) === index
    })
}

// console.log(fn1(), fn2(), fn3(), fn4())

let level = Symbol('xixixi')

const obj = {
    name: 'ZZ',
    level
}
console.log(obj)
for (const pro in obj) {
    console.log(pro)
}