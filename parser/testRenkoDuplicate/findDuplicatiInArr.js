const targetArr = [];
console.log(targetArr.length)

const str = targetArr.join("");

let sizeTarget = 5;
const result = {};

for (; sizeTarget < Math.ceil(targetArr.length / 2); sizeTarget++) {
    getDuplicate();
}

function getDuplicate() {
    for (let i = 0; i < targetArr.length; i++) {
        if (i + sizeTarget > targetArr.length - 1) break;
        const checkStr = str.slice(i, i + sizeTarget);
        if (result[checkStr]) continue;
        const f = [...str.matchAll(checkStr)];
        if (f.length <= 1) continue;
        const nextArr = [];
        f.forEach((elem) => {
            nextArr.push(str[elem.index + sizeTarget]);
            result[checkStr] = {
                next: nextArr,
            };
        });
    }
}

function checkTwins(obj){
    const result = {}
    Object.keys(obj).forEach(key => {
        const item = obj[key]
        const flag = item.next.some(i => i !== item.next[0])
        if (!flag) result[key] = item
    })
    return result
}