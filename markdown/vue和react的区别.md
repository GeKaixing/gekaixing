### vue和react的区别
##### view的更新颗粒不一样
* vue是组件更新
* react是全局更新
#### 模版语法
* vue 使用模版语法使用v-bind，v-if指令实现逻辑等，指令清晰，使用简单
* react 使用jsx语法使用表达式控制逻辑，可灵活使用
#### 状态管理
* vue vue3的官方文档描述的，通过在父组件声明reactive() 并暴露给子组件从而实现状态管理或使用官方状态管理库pinia
* react react使用context和render Hook函数的组合使用实现状态管理
#### 社区
* react 出道的更早，拥有更大的社区，
        官方出品react native支持使用ios android平台的开发。一次学习，随处编写
        next.js react强推全栈框架
* vue 社区也逐渐完善
        uniapp 可以使用vue编写微信小程序
        nuxt.js vue的全栈框架