// footer一共三个文件，HTML,CSS,JS，将HTML/CSS都放入JS中，其它页面使用footer时，只需要导入footer

//第一部分，发送ajax请求footer.html，返回HTML代码片段，写入footer 标签中
    //1.创建异步对象
    var xhrFoot = new XMLHttpRequest();

    //4.绑定监听，接收响应
    xhrFoot.onreadystatechange = function () {
      //onreadystatechange全程会调用4次
      //我们关注xhrFoot.readyState==4
      //目的是，我们只要最后一次
      if (xhrFoot.readyState == 4 && xhrFoot.status == 200) {
        //接收响应
        var result = xhrFoot.responseText;
        // console.log(result);
        var footer = document.getElementById("footer")
        footer.innerHTML = result;
      }
    }
    //2.打开连接，创建请求
    var url = `footer.html`
    xhrFoot.open("get", url, true);
    //3.发送请求
    xhrFoot.send(null);

// 第三部分：创建link元素，引入CSS文件，并追加到head标签里
var link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.setAttribute("href", "css/footer.css");
document.head.appendChild(link);
