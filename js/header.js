// header一共三个文件，HTML,CSS,JS，将HTML/CSS都放入JS中，其它页面使用header时，只需要导入JS

//第一部分，发送ajax请求header.html，返回HTML代码片段，写入header 标签中
//1.创建异步对象
var xhr=new XMLHttpRequest();
				
//4.绑定监听，接收响应
xhr.onreadystatechange=function(){
  //onreadystatechange全程会调用4次
  //我们关注xhr.readyState==4
  //目的是，我们只要最后一次
  if(xhr.readyState==4&&xhr.status==200){
    //接收响应
                var result=xhr.responseText;
                var header=document.getElementById("header")
                // result=JSON.parse(result);
                // console.log(result);
                header.innerHTML=result;
                
  }
}
        //2.打开连接，创建请求
        var url=`header.html`
xhr.open("get",url,true);
//3.发送请求
xhr.send(null);

//第二部分：未登录时，显示登录，登录成功时，改变header.html的内容，显示欢迎回来

// 第三部分：创建link元素，引入CSS文件，并追加到head标签里
var link=document.createElement("link");
link.setAttribute("rel","stylesheet");
link.setAttribute("href","css/header.css");
document.head.appendChild(link);