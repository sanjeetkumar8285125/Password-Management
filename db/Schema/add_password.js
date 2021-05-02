const { mongo, now } = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const mongoose=require('../connection');
const Schema=mongoose.Schema;
const passwordSchema=new Schema({
    password_category:{
        type:String,
        required:true
    },
    project_name:{
        type:String,
        required:true
    },
    password_details:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
passwordSchema.plugin(mongoosePaginate);
const passModel=mongoose.model('password_details',passwordSchema);
module.exports=passModel;