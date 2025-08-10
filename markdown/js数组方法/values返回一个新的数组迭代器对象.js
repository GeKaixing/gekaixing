const num=[0,1,2,3,4,5]
const num1=num.values()//返回一个新的数组迭代器对象
console.log(
   num1.next().value,
   num1.next().value,
   num1.next().value
);