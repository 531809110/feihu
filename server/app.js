//app.js 服务器端项目
//1:下载第三方模块 
//express/express-session/cors/mysql
//2:将第三方模块引入到当前程序中
const express= require("express");
const session = require("express-session");
const cors = require("cors");
const mysql = require("mysql");
//3:创建数据库连接池
var pool = mysql.createPool({
   host:"127.0.0.1",
   user:"root",
   password:"",
   port:3306,
   connectionLimit:20,
   database:"fh"
})

//4:创建web服务器监听 8080 端口
var server = express();
server.listen(8080);
//5:处理跨域 cors 
//5.1：配置允许访问程序地址(脚手架)
//     http://127.0.0.1:5050  (ok)
//     http://localhost:5050
//5.2:每请求是否验证true
server.use(cors({
  origin:["http://127.0.0.1:5500","http://localhost:5500"],
  credentials:true
}))
//6:配置session
//#session配置一定要在所有请求之前
server.use(session({
   secret:"128位字符串",    //#安全字符串
   resave:true,            //#每次请求保存数据 
   saveUninitialized:true  //#保存初始化数据
}));
//7:配置静态目录
//http://127.0.0.1:8080/01.jpg
server.use(express.static("public"));

//功能一:完成用户登录
//启动服务器app.js/启动数据库
//打开浏览器
//http://127.0.0.1:8080/login?uname=dingding&upwd=123456

server.get("/login",(req,res)=>{
  //6.1:接收网页传递数据 用户名和密码
  var u = req.query.uname;
  var p = req.query.upwd;
// console.log(u,p)
  //6.2:创建sql
  var sql = "SELECT uid FROM fh_user";
  sql+=" WHERE uname = ? AND upwd = md5(?)";
  //6.3:执行sql语句并且获取返回结果
  pool.query(sql,[u,p],(err,result)=>{
   //6.4:判断登录是否成功
   if(err)throw err;
   //6.5:将结果返回网页
   if(result.length==0){
     res.send({code:-1,msg:"用户名或密码有误"})
   }else{
     //获取当前登录用户uname
    //  console.log(result)
     //result=[{uid:1}]
     var uid = result[0].uid;
     //将用户id保存session对象中
     //uid当前登录：用户凭证
     req.session.uid = uid;
     //console.log(req.session);
     res.send({code:1,msg:"登录成功"});
   }
  });
})

// //功能1.1:用户成功登录后，传递用户名到浏览器
// //启动服务器app.js/启动数据库
// //打开浏览器
// //http://127.0.0.1:8080/username

// server.get("/username",(req,res)=>{
//   //6.1:接收网页传递数据 用户名和密码
// //2:判断当前用户是否登录成功
// //  uid
// //  如果uid为undefined 没登录
// var uid = req.session.uid;
// console.log(req.session.uid)
// if(!uid){
//   res.send({code:-1,msg:"请先登录"});
//   return;
// }else{
// //6.2:创建sql
// var sql = "SELECT uname FROM fh_user";
// sql+=" WHERE uid = ?";
//   //6.3:执行sql语句并且获取返回结果
//   pool.query(sql,[uid],(err,result)=>{
//    if(err)throw err;
//    //6.4:获取当前登录用户uname
//      req.session.uname = result[0].uname;
//      console.log(req.session.uname)
//      res.send({code:1,msg:"登录成功",sessionUname:req.session.uname});
//   });
// }
// })

//功能二:商品分页显示77~109
//1:接收客户请求 /product GET
// http://127.0.0.1:8080/product
// http://127.0.0.1:8080/product?pno=2
// http://127.0.0.1:8080/product?pno=3&pageSize=5
server.get("/product",(req,res)=>{
 //2:接收客户请求数据 
 //  pno 页码   pageSize 页大小
 var pno = req.query.pno;
 var ps  = req.query.pageSize;
 //3:如果客户没有请示数据设置默认数据
 //  pno=1     pageSize=4
 if(!pno){
   pno = 1;
 }
 if(!ps){
   ps = 4;
 }
 //4:创建sql语句
 var sql = "SELECT lid,title,subtitle,price,img_url";
 sql+=" FROM fh_product";
 sql+=" LIMIT ?,?";
 var offset = (pno-1)*ps;//起始记录数 ?
 ps = parseInt(ps);      //行数       ?
 //5:发送sql语句
 pool.query(sql,[offset,ps],(err,result)=>{
   //6:获取返回结果发送客户端
   if(err)throw err;
   res.send({code:1,msg:"查询成功",
   data:result});
 });
})
//功能三:将指定商品添加至购物车
//#此功能先行条件先登录
//0:复制 db.sql中创建购物车表sql
//在mysql 执行
//1:接收客户端请求 /addcart GET
//http://127.0.0.1:8080/login?uname=dingding&upwd=123456
//http://127.0.0.1:8080/addcart?lid=1&price=8&lname=农家蒸蛋

server.get("/addcart",(req,res)=>{
//2:判断当前用户是否登录成功
//  uid
//  如果uid为undefined 没登录
var uid = req.session.uid;
if(!uid){
  res.send({code:-1,msg:"请先登录"});
  return;
}
//3:获取客户端数据???小心处理
//  lid    商品编号
//  price  商品价格
//  lname  商品名称
var lid = req.query.lid;
var price = req.query.price;
var lname = req.query.lname;
//console.log(lid+":"+":"+lname)
//res.send(lid+":"+":"+lname);
//4:创建查询sql:当前用户是否购买此商品
var sql = "SELECT id FROM fh_cart";
sql+=" WHERE uid = ? AND lid = ?";
//5:执行sql语句
pool.query(sql,[uid,lid],(err,result)=>{
  if(err)throw err;
  //6:在回调函数中判断下一步操作
  //  没购买过此商品  添加
  //  己购买过此商品  更新
  if(result.length==0){
   var sql = `INSERT INTO fh_cart VALUES(null,${lid},${price},1,'${lname}',${uid})`;
  }else{
   var sql = `UPDATE fh_cart SET count=count+1 WHERE uid=${uid} AND lid=${lid}`;
  }
  //7:执行sql获取返回结果
  pool.query(sql,(err,result)=>{
    if(err)throw err;
    //8:如果sql UPDATE INSERT DELETE
    //判断执行成功 result.affectedRows 影响行数
    if(result.affectedRows>0){
     res.send({code:1,msg:"商品添加成功"});
    }else{
     res.send({code:-2,msg:"添加失败"}); 
    }
  })
})
})


//功能四:查询指定用户购物车信息
//http://127.0.0.1:8080/login?uname=dingding&upwd=123456
//http://127.0.0.1:8080/carts
server.get("/carts",(req,res)=>{
   //(1)参数 uid
   var uid = req.session.uid;
   if(!uid){
     res.send({code:-1,msg:"请登录"});
     return;
   }
   //(2)创建sql语句 
   var sql = "SELECT id,lname,price FROM ";
   sql+=" fh_cart WHERE uid = ?";
   //(3)执行sql语句并且将数据库返回结果发送客户
   pool.query(sql,[uid],(err,result)=>{
     if(err)throw err;
     res.send({code:1,msg:"查询成功",data:result})
   })
});




