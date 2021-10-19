class Commitment {
    static PENDING = '待定'
    static FULFILLED = '成功'
    static REJECTED = '拒绝'

    constructor(executor) {
        this.Status = Commitment.PENDING
        this.Result = null
        this.ResloveCallBacks = []
        this.RejectCallBacks = []
        let resolve = value => {
            //resolve和reject是在时间循环末尾执行的 加setTimeout
            setTimeout(() => {
                if (this.Status === Commitment.PENDING) {
                    this.Status = Commitment.FULFILLED
                    this.Result = value
                    this.ResloveCallBacks.forEach(callback => {
                        callback(value)
                    })
                }
            });

        }
        let reject = value => {
            setTimeout(() => {
                if (this.Status === Commitment.PENDING) {
                    this.Status = Commitment.REJECTED
                    this.Result = value
                    this.RejectCallBacks.forEach(callback => {
                        callback(value)
                    })
                }
            });
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }

    }
    then(onFulfilled, onRejected) {
        // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        // onRejected如果不是函数，就忽略onRejected，直接扔出错误
        onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err };
        let promise2 = new Promise((resolve, reject) => {
            if (this.Status === Commitment.FULFILLED) {
                // 异步
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.Result);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            };
            if (this.Status === Commitment.REJECTED) {
                // 异步
                setTimeout(() => {
                    // 如果报错
                    try {
                        let x = onRejected(this.Result);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0);
            };
            // 当resolve在setTomeout内执行，then时state还是pending等待状态 我们就需要在then调用的时候，将成功和失败存到各自的数组，一旦reject或者resolve，就调用它们
            // 类似于发布订阅，先将then里面的两个函数储存起来，由于一个promise可以有多个then，所以存在同一个数组内。
            if (this.Status === Commitment.PENDING) {
                this.ResloveCallBacks.push(() => {
                    // 异步
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.Result);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0);
                });
                this.RejectCallBacks.push(() => {
                    // 异步
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.Result);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
            };
        });
        // 返回promise，完成链式
        return promise2;
    }
}

const resolvePromise = (promise2, x, resolve, reject) => {
    // x和promise2不能是同一个人，如果是同一个人就报错
    if (promise2 === x) {
        return reject(
            new TypeError('Chaining cycle detected for promise #<promise>')
        )
    }
    // 判断如果x是否是一个对象，判断函数是否是对象的方法有：typeof instanceof constructor toString
    if (typeof x === 'object' && x != null || typeof x === 'function') {
        try {
            let then = x.then // 取then可以报错，报错就走reject()
            if (typeof then === 'function') {
                // 用then.call()为了避免在使用一次x.then报错
                then.call(x, y => {
                    console.log('y', y)
                    resolve(y)// 采用promise的成功结果，并且向下传递
                }, r => {
                    reject(r)// 采用promise的失败结果，并且向下传递
                })
            } else {
                resolve(x)// x不是一个函数，是一个对象
            }
        } catch (err) {
            reject(err)
        }
    } else {
        // x是一个普通值
        resolve(x)
    }
}


//设置异步例子
// console.log('first')
// let commitment = new Commitment((resolve, reject) => {
//     console.log('second')
//     resolve('登峰造极')
// })

// commitment.then(
//     result => { console.log(result) },
//     err => { console.log(err) }
// )
// console.log('third')


// 在Promise添加setTimeout例子
// console.log('first')
// let commitment = new Commitment((resolve, reject) => {
//     console.log('second')
//     setTimeout(() => {
//         resolve('登峰造极')
//         console.log('fourth')
//     });

// })

// commitment.then(
//     result => { console.log(result) },
//     err => { console.log(err) }
// )
// console.log('third')

let commitment = new Commitment((resolve, reject) => {
    console.log('second')
    resolve('登峰造极')
})
commitment.then(data => {
    console.log(data)
}).then(() => {
    console.log(123)
})