### 设计模式/6个原则
开闭，单一，依赖到置，接口隔离，迪米特，里氏替换
#### 创建型/这些设计模式可以帮助我们优雅的创建对象
    1.工厂模式/大量创建对象,写一个方法只需调用这个方法就可以拿到想要的对象
        应用场景：当一个对象需要经常创建的时候
    2.建造者模式/需要组合出一个全局对象，把一个复杂的类各个部分，拆分成独立的类，然后再最终把类组合到一起。
        应用创建：但要创建单个，庞大的组合对象时
        就是往一个类里面，丢进去其他类
```js
    function animal(){
        this.animal_name="";
        this.age='';
        this.animal_food='';
    }
    animal.prototype.setname=function(name){
        this.animal_name=name
    }
    animal.prototype.setage=function(age){
        this.animal_name=age
    }
    animal.prototype.setfood=function(food){
        this.animal_name=food
    }
    animal.prototype.bulid=function(){
        console.log('hello world');
       return{
        name:this.animal_name,
        age:this.age,
        food:this.animal_food,
       } 
    }  
    const Animal=new animal()
    console.log(Animal.bulid());
```
#### 结构型/帮助我们优雅的设计代码结构
外观模式
```js
class A{
    test(){
        console.log("hello world")
    }
}
class B{
    constructor(){
        this a=new A()
    }
    test(){
        this.a.test()
    }
}
const b=new B()
b.test()//hello world
```
适配器模式
    也类似类继承
```js
class A{
    test(){console.log('hello world')}
}
class B extends A{
    req(){
        this.test()
    }
}
```
装饰器模式
    在不修改A的代码下扩展自己的代码。

#### 行为型/模块之间行为的模式总计，帮助我们组织模块的行为
#### 技巧型/一些帮助我们优化代码的技巧