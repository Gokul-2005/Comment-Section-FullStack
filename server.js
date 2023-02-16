const express = require('express');
const app = express(); //assigning express function to app variable
const database = require('mysql'); //This line contains mysql module
const ejs = require('ejs'); //This line contains ejs module
const bodyParser = require('body-parser'); //This line contains body-parser module
const path = require('path');
const port = 5100 ;


app.use(express.static('public'));



//This line give access to ejs files
app.set("view engine","ejs");

const urlencodedParser = bodyParser.urlencoded({extended : false});
app.use(bodyParser.json());

let connection = database.createConnection({
    host : 'localhost',
    user : 'root',
    password : "",
    database : 'CommentSection',
});

connection.connect((error) => {
    if(error){
    console.log(error);
    }
});

app.post('/index',(request,response) => {
    let JSONdata = '';
    let sqlQuery = `SELECT * FROM CommentSection WHERE 1`;
    connection.query(sqlQuery,(err,res)=>{
        if(err) console.log(err);
        else{
            JSONdata = JSON.parse(JSON.parse(JSON.stringify(res))[0].Data)
            if(request.body.task==='upCountForComment'){
                JSONdata[0].comments.forEach(comment => {
                    if(comment.id===Number(request.body.arr[0])){
                        comment.score = comment.score+1;
                    }
                });
            }
            if(request.body.task==='downCountForComment'){
                JSONdata[0].comments.forEach(comment => {
                    if(comment.id===Number(request.body.arr[0])){
                        comment.score = comment.score-1;
                    }
                });
        
            }
            if(request.body.task==='upCountForReply'){
                JSONdata[0].comments.forEach(comment => {
                    if(comment.replies){
                        comment.replies.forEach((reply)=>{
                          if(comment.id===Number(request.body.arr[0]) && reply.id===Number(request.body.arr[1]))
                           reply.score = reply.score+1;
                        })
                    }
                });
            }
            if(request.body.task==='downCountForReply'){
                JSONdata[0].comments.forEach(comment => {
                    if(comment.replies){
                        comment.replies.forEach((reply)=>{
                          if(comment.id===Number(request.body.arr[0]) && reply.id===Number(request.body.arr[1]))
                           reply.score = reply.score-1;
                        })
                    }
                });
            }
            if(request.body.task==='NewComment'){
                JSONdata[0].comments.push(request.body.arr)
            }

            if(request.body.task==='newReply'){
                JSONdata[0].comments.forEach((comment)=>{
                    if(comment.id===Number(request.body.arr[0])){
                        let len = comment.replies.length+1;
                        request.body.arr[1].id=len;
                       comment.replies.push(request.body.arr[1]);
                    }
                    console.log(comment.replies);
                })
            }
            if(request.body.task==='deleteReply'){
                JSONdata[0].comments.forEach((comment)=>{
                    if(comment.replies){
                        comment.replies.forEach((reply,index)=>{
                            if(comment.id===Number(request.body.arr[0]) && reply.id===Number(request.body.arr[1])){
                                comment.replies.splice(index,1);
                            }
                    })
                    }
                })
            }
            if(request.body.task==='editReply'){
                JSONdata[0].comments.forEach((comment)=>{
                    if(comment.replies){
                        comment.replies.forEach((reply)=>{
                            if(comment.id===Number(request.body.arr.commentID) && reply.id===Number(request.body.arr.replyID)){
                                reply.content = request.body.arr.newReply
                                console.log(reply);
                            }
                    })
                    }
                })
            }
            if(request.body.task==='newNestedReply'){
                JSONdata[0].comments.forEach((comment)=>{
                    if(comment.id===Number(request.body.arr[0])){
                       let len = comment.replies.length+1;
                       request.body.arr[1].id=len;
                       comment.replies.push(request.body.arr[1]);
                    }
                })
            }
            JSONdata[0].comments.forEach(comment => {
                let temp = comment.content;
                let escapedContent = temp.replace(/'/g, "\\'");
                comment.content=escapedContent;
                if(comment.replies){
                    comment.replies.forEach((reply)=>{
                        let tempo = reply.content;
                        let escapedContent = tempo.replace(/'/g, "\\'");
                        reply.content = escapedContent;
                    })
                } 
            })
            let temp = JSON.stringify(JSONdata);
            let escapedContent = temp.replace(/\\\\/g, "\\");
            let insertQuery = `UPDATE CommentSection SET Data = '${escapedContent}' WHERE 1`;
                connection.query(insertQuery,(err,res)=>{
                    if(err) console.log(err);
                    else response.send('ok');
                })
        } 
    })
})

app.get('/index',(request,response)=>{
    let sqlQuery = `SELECT * FROM CommentSection WHERE 1`;
    connection.query(sqlQuery,(err,res)=>{
        if(err) console.log(err);
        else{
            const data = JSON.parse(JSON.parse(JSON.stringify(res))[0].Data);
            const obj = {
                data : data,
                cssPath : 'CSS/index.css',
                JsPath : 'JS/index.js',
            }
            response.render('index',{obj})
        }
    })
})

app.listen(port, () => console.log(`listening to port, ${port}`))