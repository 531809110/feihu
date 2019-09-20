// header一共三个文件，HTML,CSS,JS，将HTML/CSS都放入JS中，其它页面使用header时，只需要导入JS

//第一部分，发送ajax请求header.html，返回HTML代码片段，写入header 标签中
    //1.创建异步对象
    var xhrHead = new XMLHttpRequest();

    //4.绑定监听，接收响应
    xhrHead.onreadystatechange = function () {
      //onreadystatechange全程会调用4次
      //我们关注xhrHead.readyState==4
      //目的是，我们只要最后一次
      if (xhrHead.readyState == 4 && xhrHead.status == 200) {
        //接收响应
        var result = xhrHead.responseText;
        // console.log(result);
        var header = document.getElementById("header")
        header.innerHTML = result;

        //第二部分：未登录时，显示登录，登录成功时，改变header.html的内容，显示欢迎回来
        var storageUname = window.localStorage.getItem("data"); //将localStorage中存储的uname信息取出来
        // console.log(storageUname);
        // 当localStorage里的data被清除了，返回null，此时要给storageUname初始化
        if(!storageUname){
          storageUname=JSON.stringify({uname: "test", time: 0, date: 0});
        };
        // console.log(storageUname);
        storageUname = JSON.parse(storageUname); //将JSON转换成对象
        // console.log(storageUname);
        // 获取显示登录或者显示欢迎的父元素
        var username = document.getElementById("username");
        //检查localStorage是否过期，没过期显示欢迎，过期清除data
        var loginDate=storageUname.date+storageUname.time;
        // console.log(loginDate)
        var nowDate=new Date().getTime();
        // console.log(nowDate)
        
        if(nowDate<loginDate){
          // 点击注销后，清除data，并刷新页面
          username.innerHTML = `<span>你好！${storageUname.uname}，欢迎回来！</span> <a href="javascript:window.localStorage.removeItem('data');
          window.history.go(0);">注销</a>`;
        }else{
          window.localStorage.removeItem("data");
          username.innerHTML = `<span>您好，欢迎来到飞虎乐购！</span>
          <a href="login.html">安全登录</a>
          <span> 还没加入我们？</span>
          <a href="register.html">免费注册</a>`
        }  //第二部分结束
      }
    }
    //2.打开连接，创建请求
    var url = `header.html`
    xhrHead.open("get", url, true);
    //3.发送请求
    xhrHead.send(null);

// 第三部分：创建link元素，引入CSS文件，并追加到head标签里
var link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "css/header.css");
document.head.appendChild(link);
