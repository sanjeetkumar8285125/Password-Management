const mongoose=require('../connection');
const Schema=mongoose.Schema;
const passwordCategorySchema=new Schema({
    passwordCategory:{
        type:String,
        minLength:2,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const passwordCategoryModel=mongoose.model('passwordCategories',passwordCategorySchema);
module.exports=passwordCategoryModel;