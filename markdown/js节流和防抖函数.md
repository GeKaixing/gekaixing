### js节流和防抖函数
#### 节流函数/throttling
   * 可以理解为英雄联盟的技能，技能施法完，只能等cd结束在释放。
   * 以一定时间执行，在一秒中不管点击多少次button只有一秒后会执行。
   * 应有场景：window对象的resize、scroll事件，拖拽时的mousemove事件，网络请求等。
   * 第一个参数是要执行的函数，第二个参数要执行函数的间隔。
```js
 function th(fn, delay) {
        let lasttime = 0;
        return function (...args) {
            const nowtime = new Date()
            if (nowtime - lasttime > delay) {
                console.log('当前时间' + nowtime);
                console.log('当前时间-旧时间', nowtime - lasttime);
                fn.call(this, args)
                lasttime = nowtime;
            }
        }
    }
    const dd = th(test, 1000)
    function test() {
        console.log('hello world');
    }
    document.querySelector('button').addEventListener('click', () => {
        dd()
    })
```
- setTimeout版本
- 执行流程当是true是进入定时器，同时throttling赋值为false，用户在调用throttl时因为throttling是false，不会进入定时器，直到定时器结束，执行fn()函数和throttling=ture;用户再次调用throttl是才会调用定时器。
```js
const throttl(fn,delay)=>{
    const throttling=true;
    return ()=>{
        if(throttling){
            setTimeout(()=>{
                fn()
                throttling=true;
            },delay)
        }
        throttling=false;
    }
}
```
#### 防抖函数/debouncing
   * 可以理解为英雄联盟的回城，当在回城中再按了B键就回打断回城,重新加载回城，直到回城。
   * 以一定时间内点击button都会从重新计时，计时结束后才开始执行函数，在计时期间点击了button将重新计算。
   * 应有场景：文字输入、自动完成的keyup事件，窗口大小等。
   * 第一个参数是要执行的函数，第二个参数要执行函数的间隔。
   * deboun执行流程，当deboun()函数在第一次被调用时，会等待定时器，再次调用deboun()函数会清空上一次的定时器，再开一个定时器，以此往复，直到用户不在调用这个deboun()函数
```js
 function de(fn, delay) {
        let time;
        return function (...args) {
            clearTimeout(time)
            time = setTimeout(() => {
                fn.call(this, args)
            }, delay);
        }
    }
    function fn() { console.log('防抖函数执行了'); }
    const ff = de(fn, 1000)
    document.querySelector('button').addEventListener('click', () => {
        ff()
    })
```