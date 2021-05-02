const { schema } = require('../../../myapps/db/schema/employee');
const mongoose=require('../connection');
const Schema=mongoose.Schema;
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        minLength:3,
        maxLength:30,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        minLength:3,
    },
    password:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now
    }
})
const UserModel=mongoose.model('users',userSchema);
module.exports=UserModel;