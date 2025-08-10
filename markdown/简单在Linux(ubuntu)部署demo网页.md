简单在Linux(ubuntu)部署demo网页
-------------------------------

date:2024/4/26；
ubuntu version：20.*；

在各大云服务商购买服务器例如阿里云的ESC

###### 重置密码

##### 进入阿里云的默认远程连接

###### 更新Linux(ubuntu) 应用服务

```sudo apt-get install update```

###### 安装 nginx服务

````sudo apt-get install nginx````

###### 检查 nginx 安装成功

```nginx --version```

###### 检查 nginx 服务 是否自动启动成功

```systemctl nginx status```

###### 开启 nginx 服务

```systemctl nginx start```

###### 设置开机自动启动

```systemctl nginx enable```
当一切顺利就可以网址栏输入阿里云给**公网ip**访问到nginx的它的默认首页。<br>
打开阿里云的控制台选择对应的实例设置对应的安全网选择快速添加**安全网**，选择http 80，因为nginx默认映射ip的**80端口**，如没有设置nginx默认配置，就可以成功访问到nginx 默认首页。<br>

###### 使用vim编辑 nginx默认首页即可

```vim /var/www/html/index.nginx-debian.html```