### js的promise
异步方法不会返回最终值，而是返回一个promise，以便在将来的某个时间点提供该值。
promise必然处于以下几种状态之一：
pending 待定，初识状态，既没有被fulfilled 和rejexted
fulfilled 以兑现，意味着操作成功完成
rejected  以拒绝，意味着操作失败
resolved  以解决，等价为fulfille 也是可以是pending或rejected ，**这个概念就很模糊**，在实践中，redolved过程通常是在幕后完成的，不可观察，只有其fulfilled and rejected是可被观察的。**resolved不可被观察**
settle 以落定/敲打，promise一旦兑现和拒绝，就永远不会再从兑现变成拒绝，拒绝变成兑现。
### promise的链式调用
Promise.prototype.then()
第一参数是promise兑现时的回调函数，第二个参数是promise拒绝时的回调函数，返一个新生成的promise对象
### promise方法
* Promise.prototype.then()
第一参数是promise兑现时的回调函数，第二个参数是Promise拒绝时的回调函数，返一个新生成的promise对象
* promise.prototype.catch()
catch()方法只是对调用then()时以null作为第一个参数，以指定的错误处理函数作为第二个参数的一种简写。
* Promise.prototype.finallY()
### 附加
finallY：/ˈfaɪnəli/
异步技术在运行时，它的调用者已经不在调用载里，因此如果出现错误，根本没办法向调用者抛回异常。cd
