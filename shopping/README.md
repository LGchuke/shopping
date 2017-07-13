### 安装

先在全局安装*gulp*
```
npm install gulp -g
```
安装Weinre
```
npm install weinre -g
```

再安装依赖
```
npm install
```

### 使用
调试开发
```
gulp
```

编译
```
gulp clean
gulp build
```
编译出来的目标文件在dist文件夹内

Weinre
```
weinre --boundHost 本机IP地址
```
控制台地址
http://ip:8080/client/#anonymous

引入脚本
```
<script src="http://ip:8080/target/target-script-min.js#anonymous"></script>
```