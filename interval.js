const timerInit = 1000
let tt = 1000
let timer = null

const timerAdd = () => {
    timer = setInterval(() => {
        tt += timerInit
        clearInterval(timer)
        console.log('cnm', new Date().getSeconds())
        timerAdd()
    }, tt)
}


const setIntervalStep = (a, b) => {
    setTimeout(() => {
        console.log(new Date().getSeconds())
        setIntervalStep(a + b, b)
    }, a);
}


setIntervalStep(1000, 2000)