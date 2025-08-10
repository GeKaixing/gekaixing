# windows安装 stripe CLI
点击链接下载[stripe CLI 1.22.0](https://github.com/stripe/stripe-cli/releases/download/v1.22.0/stripe_1.22.0_windows_x86_64.zip).  
点击下载完毕的stripe_1.22.0_windows_x86_64.zip解压到当前文件夹默认解压的文件夹是stripe_1.22.0_windows_x86_64,文件夹中的文件是stripe.exe  
将解压的stripe文件添加到path环境变量中,点击windows设置,点击关于,点击高级设置,点击环境变量,设置你的用户名path变量,双击击path然后点击新建选择stripe.exe的目标目录  
powershell 输入stripe --version 输出stripe version 1.22.0添加成功  
# mac安装 stripe CLI  
```brew install stripe/stripe-cli/stripe```
