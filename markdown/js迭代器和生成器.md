### js迭代器和生成器
迭代：从一个数据集合中张照一定的顺序，不断的取数据的过程。
迭代和遍历的区别
【过程】迭代强调依次取出，不能确定可以取出的值有多少，也不能保证去把数据全部取出。
【结果】遍历必须保证数据的长度，循环不断的全部取出，针对于数据量过大的情况下使用遍历，需要时间过长。
### 迭代的基本使用
```js
let arr = [1, 2, 3]
    //创建迭代器 
    let iter = arr[Symbol.iterator]();
    console.log(iter.next());
    //done:表示还有值，迭代还可以继续，value：迭代对象的值
    /*  done: false,value: 1  */
    
```
### 哪些是可迭代对象
array
map()
string
document数组
可迭代对象可以使用for...of 来循环来**判断**
```js
 let arr = [1, 2, 3]
 for(let i of arr){
        console.log(i);
        //输出：1,2,3
    }
```
**objact不是可迭代对象**
```js
 for(let i of obj){
        console.log(i);
        //输出：Uncaught TypeError: obj is not iterable
    }
```
### 
**这个obj没有变成可迭代对象**此处有待商榷
```js

    let obj = {
        name: 'hello', age: 2,
        [Symbol.iterator]() {
            let index = 0;
            let this_ = this;
            return {
                next() {
                    if (index < this_.name.length) {
                        let ret = { done: false, value: this_.name[index] }
                        index++
                        return ret;
                    } else {
                        return { done: true, value:undefined }
                    }

                }

            }
        }
    }
    let iterator = obj[Symbol.iterator]();
    console.log(iterator.next());//h
    console.log(iterator.next());//e
    for (let value of obj) {
        console.log(value);
        //输出：h,e,l,l,o
    }
```
### 生成器
生成器远用，yield关键字，function* 
```js
    function* testfn (){
        console.log('执行了');
        yield 1;
        yield 2;
        yield 3;
    }
     //testfn() 并不会执行函数
    let test=testfn()//创建一个迭代器
    console.log(test.next());//输出：{value: 1, done: false}，输出和迭代器一样，当没有值时是{ value:undefined,done: true,}。遇到关键字yield就会停下来，并跳出这个函数
    // 同时可以使用for...of
    for(let value of test){
        console.log(value);//输出：2，3。因为1已经迭代出去
    }
```
模拟原生casync和await
```js
    function my_async(fn,...params){
        let iter=fn(...params)
        const next=x=>{
            let{value,done}=iter.next(x)
            if(done){return}
            value.then(next)
        }
        next()
    }   
    my_async(function* fn(x){
        let result1=yield promiseapi(x);
        let result2=yield promiseapi(result1);
        let result3=yield promiseapi(result2);
    },0)
```