```js
    const num = 1
    console.log(typeof num);
    console.log(Object.prototype.toString.call(num));
    const str = 'hello'
    console.log(typeof str);
    console.log(Object.prototype.toString.call(str));
    const arr = [1]
    console.log(typeof arr);//object
    console.log(Object.prototype.toString.call(arr));
    const obj = { 1: 1 }
    console.log(typeof obj);//object
    console.log(Object.prototype.toString.call(obj));
    const nl = null
    console.log(typeof nl);//object
    console.log(Object.prototype.toString.call(nl));
    const udf = undefined
    console.log(typeof udf);
    console.log(Object.prototype.toString.call(udf));
    const nan = NaN
    console.log(typeof nan);//number
    console.log(Object.prototype.toString.call(nan));
    const sym = Symbol('world')
    console.log(typeof sym);
    console.log(Object.prototype.toString.call(sym));
    const bl = true
    console.log(typeof bl);
    console.log(Object.prototype.toString.call(bl));
    const fn=()=>{}
    console.log(typeof fn);
    console.log(Object.prototype.toString.call(fn));
    const date=new Date()//object
    console.log(typeof date);
    console.log(Object.prototype.toString.call(date));
    const reg=new RegExp()//object
    console.log(typeof reg);
    console.log(Object.prototype.toString.call(reg));
```