//字符串出现最多的
const Str = 'abdbcccddvcddd'
function stringTimerNumber(string) {
    let stringObj = {}
    let Arr = [...string]
    for (let i = 0; i < Arr.length; i++) {
        if (stringObj.hasOwnProperty(Arr[i])) {
            stringObj[Arr[i]] += 1
        } else {
            stringObj[Arr[i]] = 0
        }

    }
    return stringObj
}

console.log(stringTimerNumber(Str))

//字符串出现的不重复最长长度
var lengthOfLongestSubstring = function (s) {
    let map = new Map();
    let i = -1
    let res = 0
    let n = s.length
    for (let j = 0; j < n; j++) {
        if (map.has(s[j])) {
            i = Math.max(i, map.get(s[j]))
        }
        res = Math.max(res, j - i)
        map.set(s[j], j)
    }
    return res
};

var lengthOfLongestSubstring2 = function (s) {
    const arr = [...s]
    let res = 1;
    let result = arr.reduce((total, cur, i, arr) => {
        if (i == 0) {
            return cur;
        } else {
            if (total.indexOf(cur) < 0) {
                return total + cur
            } else if (res < total.length) {
                res = total.length
                return total.slice(total.indexOf(cur) + 1, total.length) + cur
            } else {
                return total.slice(total.indexOf(cur) + 1, total.length) + cur
            }
        }
    }, "")
    if (res < result.length) {
        res = result.length
    }

    return res
};

