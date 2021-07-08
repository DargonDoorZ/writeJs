//event-loop
async function async1() {
    console.log('A')
    await async2()
    console.log('B')
}
async function async2() {
    console.log('C')
}
console.log('D')

setTimeout(function () {
    console.log('E')
})

async1()

new Promise(function (resolve) {
    console.log('F')
}).then(function () {
    console.log('G')
})

console.log('H')