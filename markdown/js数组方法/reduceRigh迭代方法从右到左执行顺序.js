const num = [0, 1, 2, [3, 4, 5]]
console.log(
    num.reduceRight((a, b) => a.concat(b))//扁平化数组，但该方法是数组从右开始至此执行[ 3, 4, 5, 2, 1, 0 ]
);
// 参数1：累加寄存器 
// 参数2：当前值