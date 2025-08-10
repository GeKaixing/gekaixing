const num1 =[0,1,2,3,4,5]//修改原数组
// console.log(num1.copyWithin(3));
// console.log(num1.copyWithin(4));
//console.log(num1.copyWithin(2,4));//[ 0, 1, 4, 3, 4 ],[ 0, 1, 4, 5, 4 ,5]
//console.log(num1.copyWithin(1,3));//[ 0, 3, 4, 3, 4 ]
/* 
参数1：数组要修改的位置，默认选择0索引复制元素，参数1索引为粘贴位置，[ 0, 1, 2, 3, 0 ]
参数2：数组要复制的位置的开始[ 0, 1, 4, 3, 4 ]
参数3：数组要复制开始到结束的位置
*/