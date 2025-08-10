# promise静态方法
## all
- resolved返回一个所有被兑现的数组 参数可迭代对象（常见：数组，字符串 ，new set new map 迭代器对象...)  
- 只要有reject状态就返回reject  
- 而any方法是只有全部是rejected状态才返回reject  
```js
Promise.all([
    new Promise(resolve => setTimeout(() => {  resolve(2); }, 2000)),
    new Promise(resolve => setTimeout(() => { resolve(1); }, 1000)),
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
])
  .then((res) => {
    console.log(res);
  })
  .catch((e) => console.log(e));
  // output  [2, 1, 3, 4,  5,6, 7, 8, 9, 10]
```  
- reject 返回第一个被拒绝的原因  
```js
Promise.all([1,2,Promise.reject('我出错了'),4,5,6,7,Promise.reject('我也出错了'),9,10])
.then(res=>{
    console.log(res)
}).catch(e=>console.log(e)) 
//output 我出错了
```  
## allsettled  
- allsetted 返回一个resolved状态的promise数据，不管参数是否是rejected状态，都将在以resolved状态返回promise数据  
```js
Promise.allSettled([
  1,
  2,
  Promise.reject("我出错了"),
  4,
  5,
  6,
  7,
  Promise.reject("我也出错了"),
  9,
  10,
]).then(res=>console.log(res)).catch(e=>console.log('error'+e))
/* output [
    { status: 'fulfilled', value: 1 },
    { status: 'fulfilled', value: 2 },
    { status: 'rejected', reason: '我出错了' },
    { status: 'fulfilled', value: 4 },
    { status: 'fulfilled', value: 5 },
    { status: 'fulfilled', value: 6 },
    { status: 'fulfilled', value: 7 },
    { status: 'rejected', reason: '我也出错了' },
    { status: 'fulfilled', value: 9 },
    { status: 'fulfilled', value: 10 }
  ]
*/
```  
## any  
- 返回任何一个第一个resolved状态的promise对象，当只有全错的时候才返回rejected 参数：是一个可迭代的对象  
```js
Promise.any([
    1,
    2,
    Promise.reject("我出错了"),
    4,
    5,
    6,
    7,
    Promise.reject("我也出错了"),
    9,
    10,
  ]).then(res=>console.log(res)).catch(e=>console.log('error'+e))
  //output 1
  Promise.any([
    Promise.reject("我第一个出错了"),
    1,
    2,
    Promise.reject("我出错了"),
    4,
    5,
    6,
    7,
    Promise.reject("我也出错了"),
    9,
    10,
  ]).then(res=>console.log(res)).catch(e=>console.log('error'+e))
  //output 1
  //全部都是rejected的情况下
  Promise.any([
    Promise.reject("我第一个出错了"),
    Promise.reject("我出错了"),
    Promise.reject("我也出错了")
  ]).then(res=>console.log(res)).catch(e=>console.log(e))
  /* output [AggregateError: All promises were rejected] {
  [errors]: [ '我第一个出错了', '我出错了', '我也出错了' ]
} */
```  
## race  
- 返回第一个被确认状态的Promise对象
- 假如第一个被确认状态是resolved，那么返回第一个被确认状态的Promise对象，并忽略后面所有的Promise对象。
- 假如第一个被确认状态是rejected，那么返回第一个被确认状态的Promise对象，并忽略后面所有的Promise对象。
- 这和Promise.any() 不同any只有全部状态都是rejected的时候才会返回rejected状态  
```js
const p1 = Promise.resolve(1)
const p2 = Promise.resolve(2)
const p3= Promise.resolve(3)
const perror=Promise.reject('我出错了')
Promise.race([p1,perror,p2,p3]).then(res=>console.log(res)).catch(e=>console.log(e))//output 1
Promise.race([perror,p1,p2,p3]).then(res=>console.log(res)).catch(e=>console.log(e))//output 我出错了
```  
## reject  
- 返回一个已拒绝的promise对象，参数为拒绝的原因
```js  
Promise.resolve(Promise.reject('我发生错误')).then().catch((error)=>console.log(error))
```  
## resolve
- 返回一个promise对象，参数value
```js  
const promiseobject = Promise.resolve(42);
```  
## try  
- 兼容性差
```js  
console.log(Promise.try((a,b,c)=>{return a+b+c},1,2,3))
```
## withResolvers
```js  
let { promise, resolve, reject } = Promise.withResolvers();
console.log(promise,resolve,reject)
```