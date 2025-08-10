### 控制对象属性的可枚举，可删除，可配置
* 每个属性都有三个关联特性：可写 可枚举 可配置
* 数据属性的4个特性：值 写 枚举 配置
* 访问器属性的特性：set（） get（） 枚举 配置
* 属性描述符的增删改查
 Object.getOwnPropertyDescriptor({},'') 查看和获取特定对象某个属性的的描述符 传入(对象，对象的属性以字面量表示)
 Object.defineProperty({},"",{}) 修改和设置某个属性的的描述符，没有写的值模式false和undefined 传入（对象，对象的属性名，属性描述符对象）
 Object.defineProperties({},{}) 一次性创造和修改多个属性
 ```js
   const p= Object.defineProperties({},{
        h:{value:"hello"},
        w:{value:"world"},
        s:{get(){return 'test'}}
    })
    console.log(p.h);//hello
 ```
 Object.create({},{}) 创建对象的函数 传入(对象的原型对象，属性描述符对象)，注意该函数会把第一个参数设置其原型
 ```js
  const cc = Object.create({
        h: "hello",
        w: "world"
    }, {
        s: { get() { return 'test' } }
    })
    console.log(cc.h);//hello
 ```
 - Object.assign() 只能复制可枚举属性和属性值 可以使用Object.defineProperty()和Object.getOwnPropertyDescriptor()实现复制属性描述符
### 控制对象的可扩展能力，创建封存和冻结对象
* Object.isExtensible(cc) 确定对象是否可以扩展
* Object.preventExtensions(a) 使一个对象不可扩展，返回穿给函数的对象，这是不可逆 在调用Object.isExtensible(cc)则是false
* Object.seal() 封存对象本身，返回穿给函数的对象
* Object.isSealed() 确定对象是否封存
* Object.freeze()冻结对象本身，返回穿给函数的对象
* Object.isFrozen() 确定对象是否冻结
**以上函数不会封存和冻结原型，可以使用原型隐形添加属性**
### 查询和设置对象的原型
* Object.getPrototypeOf(a) 查询任何对象的原型
* b.isPrototypeOf(a) Object.prototype.isPrototypeOf(a) 要确定一个对象是不是另一个对象的原型
* Object.setPrototypeOf(a，b) 修改对象的原型,传入（需要修改的对象，修改到目标对象的对象），使用这个代码的修改后的对象会执行会变慢。
* _ _proto_ _ 该方法已经弃用
### 使用公认符号调优类型的行为
所谓的公认符号其实就是symbol()工厂函数的一组属性，也就是一组属性，通过这些符号值，我们可以控制js的对象和类的某些底层行为
* Symbol.iterator 把对象和类变成可迭代对象
* Symbol.asyncIterator 把对象和类变成异步可迭代对象
* Symbol.hasInstance 
* Symbol.toStringTag Object.prototype.toString.call()使用这个函数查看类型时，会优先查看Symbol.toStringTag的值，有则会输出这个属性的值
* Symbol.species
* Symbol.isConcatSpreadable
* Symbol.toPrimitive
* Symbol.unscopables
### 使用模版标签函数创建DSL领域专用语言
**标签函数**
```js
  function html(strings,...values){
        let escaped=values.map((item)=>String(item).replace("&","&amp;"))
        let result=strings[0]   
        for(let i=0;i<escaped.length;i++){
            result+=escaped[i]+result[i+1]
        }
        return result;
    }
    const hello ="&"
    console.log(html`<div>${hello}</div>`);
```
### 反射API探究对象
Reflect对象的属性是一组相关的函数，这组Reflect函数一对一的映射了Proxy处理器方法
* Reflect.apply(f,o,args)
* Reflect.construct(c,args,newTarget)
* Reflect.defineProperty(o,name,descriptor)
* Reflect.deletePropety(o,name)
* Reflect.get(o,name,receiver)
* Reflect.getOwnPropertyDescriptor(o,name)
* Reflect.getPrototypeof(o)
* Reflect.has(o,name)
* Reflect.isExtensible(o)
* Reflect.ownKeys(o)
* Reflect.preventExtensions(o)
* Reflect.set(o,name,value,receiver)
* Reflect.setPrototyprOf(o,p)
### 代理控制对象行为
Proxy是js最强大的元编程特性，可以修改js对象的基础行为
创建代理对象时需要指定目标对象，处理器对象
```js
    // x：目标对象，p：处理器对象
 const proxy=new Proxy(x,p)
```
这称之为透明包装器，在可撤销代理或者停止代理时有用
```js
    const x ={c:1}
    const proxy=new Proxy(x,{})
    console.log(proxy.c);//x
```    
该函数返回一个对象，对象属性有代理对象和revoke函数，调用revoke函数可以撤销代理
```js
const{proxy,revoke}=Proxy.revocable(x,{})
revoke()//撤销代理
proxy()//TypeError
```
```js
 const proxy=new Proxy(x,{
        get(o,name,terget){return name;}
    })
```
使用代理对象定义处理器方法，拦截对象操作，但仍然把操作委托给目标对象