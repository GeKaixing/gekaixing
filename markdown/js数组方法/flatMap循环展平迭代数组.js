/* 
flatMap方法即先遍历，再flat展平为1级的嵌套数组
const arr1 = [1, 2, 1];
//在元素等于2的位置替换为[2,2]，然后展平数组
const result = arr1.flatMap((num) => (num === 2 ? [2, 2] : 1));//返回一个新数组
console.log(result);
// Expected output: Array [1, 2, 2, 1]
*/