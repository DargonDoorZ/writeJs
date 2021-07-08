const promisesAll = promises =>
  new Promise((resolve, reject) => {
    const result = []
    let flagIndex = 0
    const len = promises.length
    for (let i in promises) {
      Promise.resolve(promises[i])
        .then(res => {
          result[i] = res
          flagIndex++
          if (flagIndex === len) {
            resolve(result)
          }
        })
        .catch(err => {
          reject(err)
        })
    }
  })

const fn = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('01-成功')
  }, 1000)
})

const fn2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('02-成功')
  }, 800)
})

const fn3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('03-成功')
  }, 3000)
})

const fn4 = '04-成功'
const getAllData = async () => {
  const res = await promisesAll([fn, fn2, fn3, fn4]).catch(err => {
    console.log('err', err)
  })
  console.log(res)
}

getAllData()
