# 使用ReactNative的问题
--------
* 使用expo搭设开发环境，调试真的很简单，使用blank模版安装最少库
    npx create-expo-app StickerSmash --template blank
    * 使用  Expo CLI 安装依赖
    npx expo install <example>
* 使用react-navigation库导航，不使用expo router原因是可供查询的资料太少
  * 嵌套导航，需要在Tab.Screen嵌套导航栏的页面中出现的路由屏幕
* 使用RTK做状态管理但不使用RTKQ做网络请求，RTKQ的编写方式阅读太差，太繁琐
* 使用fatch或者ajax等其他网络请求时，把url替换为本机ipv4地址，例如http://127.0.0.1:4000/account改为http://your-pc-ipv4:4000/account，（详细省略）
* 
