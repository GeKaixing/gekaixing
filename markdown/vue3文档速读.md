### vue3文档速度
* npm create vue@vue@latest 
    - **注意**的是需要安装vite依赖，使用 npm install
### 基础
#### 创建一个应用
```js
app.createApp(/* 组件名 */).mount(/* DOM节点 */)
```
#### 模版语法
v-bind指令，表示绑定动态的。可以在{{写表达式}}
- **注意**不能返回html元素。
#### 响应式基础
ref()和reactive()，均采用proxy，代理数据。
ref()中可以写任何数值，而reactive中只能写引用数据。当他们两最终都会是引用数值。
这两个的**解包**需要注意一下，模版中自动解包，而在script中ref需要.vue;reactive则不需要。        
#### 计算属性
computed(()=>{})只有数据变动时会运算，它返回的数据是响应式的。
#### 类与样式绑定
类的动态绑定和样式均使用v-bind
在类中使用表达式[]，例如三元表达式
#### 条件渲染
均为boolean值 v-if和v-show，区别v-show是将元素样式设置为none，v-if移除元素
#### 列表渲染
v-for ="(item,index,) in arr " :key ='index'
#### 事件处理
v-on或者@事件名，和修饰符。
#### 表单输入绑定
v-html='';简化了<input
  :value="text"
  @input="event => text = event.target.value">这一步
#### 生命周期
从出生到死亡
当需要获取dom元素的时候可以使用
onMounted(()=>{})
#### 侦听器
侦听数据变换才执行的API
|watch | watchEffect | watchPostEffect| 
|----|----|----|
|请两个设置追踪的数据不同｜后两个执行时间不同｜
#### 模版应用
获取DOM元素
const dd=ref(null)
<div ref='dd'></div>
配合生命周期API使用

#### 组件基础
   defineProps(['父组件的传的值的名字'])
   <slot>插槽

