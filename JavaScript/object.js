let u = { a: { b: 1 } };
Object.freeze(u)
let b = Object.assign({}, u)
b.a.b = 2
console.log(b)
