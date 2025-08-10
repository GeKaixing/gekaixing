# call bind apply
## call
param1:指定函数内部的 this 指向。  
param2:传递给函数的参数，按顺序列出。  
call()会立即执行函数。并不会永久绑定this指向
```js
function test(...param){
    console.log(this.Hello)
    console.log(param)
}
const param1={
    Hello:'Hello world'
}
const param=[1,2,3,4,5];
test.call(param1,...param);//Hello world [1, 2, 3, 4, 5]
test()//undefined []
```
# apply  
param1:指定函数内部的 this 指向。  
param2:传递给函数的参数，按**数组**元素顺序列出。  
apply()会立即执行函数。并不会永久绑定this指向
```js
function test(param2=[],param3=[]){
    console.log(this.Hello)
    console.log([...param2,...param3])
}
const param1={
    Hello:'Hello world'
}
const param2=[1,2,3];
const param3=[4,5];
test.apply(param1,[param2,param3]);//Hello world [1, 2, 3, 4, 5]
test()//undefined []
```
## bind  
param1:指定函数内部的 this 指向。  
param2:传递给函数的参数，按顺序列出。  
bind()不会立即执行函数，而是返回一个函数，返回的函数会永久绑定this指向。     
值得注意的是bind()返回的函数，再次传参是无效的。    
如果需要延迟传参，需要在调用bind()函数时不传入参数。  
```js
function test(param2=[],param3=[]){
    console.log(this)
    console.log(this.Hello)
    console.log([...param2,...param3])
}
const param1={
    Hello:'Hello world'
}
const param2=[1,2,3];
const param3=[4,5];
const param4=[7,8,9];
const param5=[10,11];
const func=test.bind(param1,param2,param3);//这样编写传参就固定了。后续在调用bind()返回的函数传参是无效的。
const func2=test.bind(param1);//这样编写bind()没有传递参数，当可以在调用bind()返回的函数是可以传参，就不会固定，同时this指向也不会改变。
func(param4,param5)//{ Hello: 'Hello world' } undefined [ 1, 2, 3, 4, 5 ]
func2(param4,param5)//{ Hello: 'Hello world' } Hello world [ 7, 8, 9, 10, 11 ]
func('你好','世界')//{ Hello: 'Hello world' } undefined []
test()//global undefined []
```