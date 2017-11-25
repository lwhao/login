const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = require('url');
const querystring = require('querystring')
mongoose.connect('mongodb://127.0.0.1:27017/user');
let infoSchema = new mongoose.Schema({
    username:String,
    password:String
})
let ageSchema = new mongoose.Schema({
    username:String,
    age:Number
})
let info = mongoose.model('info',infoSchema);
let age = mongoose.model('age',ageSchema);

const app = express();
app.use(bodyParser())
app.get('/',(req,res)=>{
    fs.readFile('./index.html',(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        res.end(data);
    })   
})
app.get('/login',(req,res)=>{
    fs.readFile('./login.html',(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        res.end(data);
    })
})
app.post('/zhuce',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    let nianling = parseInt(req.body.age);

    info.create({username:username,password:password},(err,data)=>{
        console.log(data);        
    })
    age.create({username:username,age:nianling},(err,data)=>{
            console.log(data);
    })
    
    res.setHeader('Content-Type',"text/html;charset='utf-8'")
    res.end("注册成功<p><a href='http://127.0.0.1:8888/login'>点击跳转到登陆页面</a></p>");
})
app.post('/login',(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    info.find({username:username,password:password},(err,data)=>{
        if(err){
            console.log(err);
            return;
        }
        res.setHeader('Content-Type',"text/html;charset='utf-8'")
        if(data.length>0){    
            age.find({username:username},(err,data)=>{
                console.log()
                res.end(`年龄查询成功，你的年龄是${data[0].age}`);
            })        
            
        }else{
            res.end('用户名或者密码不正确');
        }
    })
})
app.get('/data',(req,res)=>{
    var params= querystring.parse(url.parse(req.url).query);
    res.end(`${params.callback}('success')`)
})
app.listen(8888)