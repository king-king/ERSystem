<img src="zach.gif">
使用说明
=========

## 数据库中都记录了什么？
```javascript
doc={
    origin:[String ],// 访问者的地址
    userAgent:[String ],//浏览器的代理
    date:[Date ],// 记录的时间
    err:[String ],//错误描述
    mark:[String ],//备注
    version:[String ],//代码的版本
    solve:[Boolean ]// 该错误是否被解决
}

```


## 都有什么接口？

+ "/insert" [post] 插入一条错误记录

    需要包含的数据内容
    ```javascript
        sendData={
            project：[string] [必填],//项目名称 系统会为每个项目单独设置一个集合
            err：[string] [必填],//错误描述
            version:[number][必填],//代码版本，是一个正整数，可以据此排除用户缓存等问题
            mark：[string] [可选]//错误描述
        }
        
    ```
    
## 基本需求
+ 查询所有的未处理错误

+ 查询最新的10条错误

+ 查询出错误最多的浏览器


## 后期会添加的功能

+ 可以对某个错误添加标记，表示该错误已经解决，该错误的出错次数会被清零，
当然如果仍然出错，这些错误让仍会被记录

