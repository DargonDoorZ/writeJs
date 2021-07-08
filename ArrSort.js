let Arr = [{ A: 1, B: 2 }, { A: 4, B: 8 }, { A: 3, B: 1234 }, { A: 34, B: 45 }]
Arr.sort((a, b) => {
    return b.B - a.B
})

let NumArr = [1, 232, 45, 56, 67, 6, 23, 1221]
NumArr.sort((a, b) => {
    return b - a
})
// console.log(NumArr)

// 快速排序
function quickSort(arr) {
    if (arr.length < 2) return arr;
    let left = [];
    let right = [];
    let flag = arr.splice(arr.length - 1, 1)[0];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] > flag) {
            right.push(arr[i]);
        } else {
            left.push(arr[i]);
        }
    }
    return quickSort(left).concat(flag, quickSort(right));
}
// 冒泡排序
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
    }
    return arr;
}

// 选择排序 
function selectSort(arr) {
    let min = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        min = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) {
                min = j;
            }
        }
        [arr[i], arr[min]] = [arr[min], arr[i]];
    }
    return arr;
}
console.log(quickSort(NumArr), bubbleSort(NumArr), selectSort(NumArr))

//斐波那契队列
function month(a) {
    if (a === 1 || a === 2) {
        return 1;
    } else {
        return month(a - 2) + month(a - 1);
    }
}
console.log(month(30));