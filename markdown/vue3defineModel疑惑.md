# vue3 defineModel疑惑
vue 3的单向数据流数据流原则好像只使用defineProps
在官方文档中‘深入组件’中描述，这样是不能对props传入的值进行修改，而到了组件 v-mode小节
也只是对props的值不能修改，它给出了defineModel的方法，又可以对props的值进行修改。而在看到3.4版本前的代码示例又傻了，传入props和emit，去子组件修改v-model
绑定的props传进来的值。