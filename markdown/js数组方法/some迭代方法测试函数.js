const num =[0,1,2,3,4,5]
console.log(num.some(item=>item===2));
/* 
some方法遍历满足回调函数的元素，满足返回ture没有return false 不会修改原数组
*/