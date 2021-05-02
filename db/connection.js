const mongoose=require('mongoose');
const config=require('./config');
mongoose.connect(config.dbURL,{poolSize:config.poolSize},(err)=>{
    if(err){
        console.log("error in connection",err);
    }
    else{
        console.log("connected created");
    }
})
module.exports=mongoose;