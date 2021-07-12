//event-loop
// async function async1() {
//     console.log('A')
//     await async2()
//     console.log('B')
// }
// async function async2() {
//     console.log('C')
// }
// console.log('D')

// setTimeout(function () {
//     console.log('E')
// })

// async1()

// new Promise(function (resolve) {
//     console.log('F')
// }).then(function () {
//     console.log('G')
// })

// console.log('H')

console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end')
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')

// script start ->