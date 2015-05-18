<img src="src/img/zach.gif">
使用说明
=========

## 数据库中都记录了什么？

会为每个项目单独设置一个集合，每个集合中包含若干文档，每个文档的结构如下：
```javascript
doc={
    origin:[String ],// 访问者的地址
    userAgent:[String ],//浏览器的代理
    date:[Date ],// 报错的的时间
    err:[String ],//错误描述
    mark:[String ],//备注
    version:[Number ],//代码的版本
    solve:[Boolean ]// 该错误是否被解决
}

```


## 都有什么接口？

+ "/insertOne" [post] 插入一条错误记录
##### 需要发送的数据内容：
    ```javascript
        sendData={
            project：[String] [必填],//项目名称 系统会为每个项目单独设置一个集合
            err：[String] [必填],//错误描述
            version:[Number][必填],//代码版本，是一个正整数，可以据此排除用户缓存等问题
            mark：[String] [可选]//错误描述
        }
        
    ```

+ "/getUnsolvedErr?project=projectName" [get] 得到项目projectName的所有未解决err
##### 返回的数据结构：
     ```javascript
        {
            "code": 200,
            "result": [
                {
                    "_id": "undefined is not a function",
                    "count": 6
                },
                {
                    "_id": "image 404",
                    "count": 4
                },
                {
                    "_id": "timout",
                    "count": 3
                }
            ]
        }
            
     ```
  
需要特别注意的是，某些浏览器显示数据的时候会错误的把_id写作id，写成id是取不到数据的。

+ "/getProjectList" [post] 得到所有的项目
##### 返回的数据结构：
     ```javascript
        {
            "code": 200,
            "result": [
                {
                    "name": "projectName1"
                },
                 {
                     "name": "projectName2"
                 }
            ]
        }
            
     ```
     
+ "/getUnsolvedErrCountInTodayByHours?project=projectName" [get] 得到一个项目在今天每小时错误出现的次数
    ```javascript
    {
        "code": 200,
        "result": [
            {
                "_id": {
                    "hour": 2
                },
                "count": 200
            }
        ]
    }
    
    ```
注意，返回的小时是utc时间，要转换成北京时间还需要加8小时
