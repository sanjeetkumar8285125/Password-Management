const express=require('express');
const app=express();
const path=require('path');
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const view=path.join(__dirname,'/views');

app.set('view engine','ejs');
app.set('views',view);

app.use('/',require('./routes/index'));

app.listen(process.env.port || 1234,()=>{
console.log("server is up and running on port 1234");
})

