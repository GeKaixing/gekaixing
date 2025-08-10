js区分大小写
js忽略空格
js将换行符,回车符，;为终止符
js的字面量是一种直接出现在程序中的数据值下面是常见的字面量
    1，1.2，true false null "hello"
js的标识符（变量名）和保留字，标识符可以用字母，_,美元符号，数字不能做为标识符开头，是以便js区分标识符和数值，后面的标识符可以是数值，例如：var hello1_$='hello world'
    保留字js的语法词，由于保留字和关健字的使用规则模糊，**保留字**和**关键字**最好**不要当标识符使用**虽然当前没有被使用但是后续的版本可能会用到。如下面例子：if可是对象的属性名，但不能是标识符
```js
    const text={if:'hello'}
    const if="world"
    console.log(if);//Uncaught SyntaxError
    console.log(text.if);//=> hello
```
js是使用Unicode字符集编写的因此可以使用Unicode字符作为标识符（但是表情包不行）
    unicode转译，由于有些计算机和软件无法识别全部unicode字符集，可以使用转译序列，/u开头例下
```js
console.log('\u{1F600}');//打印笑脸
```
js的终止符,可以是换行符，回车符，回车和换行序列和显示的添加;表明终止符，而js可不写;js会在编译器中隐试的添加;其规则较为模糊，只要解析不了就添加,不能把第二行解析为第一行时就添加，通常（,[,+,-,/有可能被解释之前语句的一部分，return throw yield break countuinue语句换行和回车就添加。
