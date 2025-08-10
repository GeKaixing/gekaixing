# js 观察者模式
--------
只不过在迭代调用数组元素某个方法的调用
````js
    class subject {
        constructor() {
            this.observers = [
            ]
        }
        print(){
            console.log(this.observers)
        }
        add(observer) {
        this.observers.push(observer)
        }
        remove(observer) {
            this.observers = this.observers.filter(obs => obs !== observer);
        }
        **notifyObservers(message){
            this.observers.forEach(observer=>observer.updated(message))
        }**
    }
    class observer{
        updated(message){
            console.log(`observer received message:${message}`)
        }
    }
    const subject1 =new subject()
    const observe1=new observer()
    const observe2=new observer()
    subject1.add(observe1)
    subject1.add(observe2)
    subject1.print()
    subject1.notifyObservers("Hello Observers!"); // 应该通知所有观察者消息
````
# js装饰器模式
````js  
    class cost{
        coffeeBean(){
            return 5
        }
    }
    class coffee{
        price(){
            const costObj = new cost()
            return costObj.coffeeBean()+4
        }
    }   
    const coffee1=new coffee()
    console.log(coffee1.price());
````