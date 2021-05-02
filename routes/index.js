const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const UserModel=require('../db/Schema/userModel');
const jwt=require('jsonwebtoken');
const passwordCategoryModel=require('../db/Schema/password_category');
const passModel=require('../db/Schema/add_password');

var getPassDetails=passModel.find({});
var getPassCat=passwordCategoryModel.find({});

function checkLoginUser(req,res,next){
  var userToken=localStorage.getItem('userToken');
try{
  var decoded=jwt.verify(userToken,'loginToken');
}catch(err){
  res.redirect('/');
}
next();
}

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/',(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  if(loginUser)
  {
    res.redirect('/dashboard');
  }
  else{
  res.render('index',{title:'Employee Management System',msg:''});
  }
})

 router.post('/',(req,res,next)=>{
  var username=req.body.uname;
  var password=req.body.password;
   var checkuser=UserModel.findOne({username:username});
   checkuser.exec((err,data)=>{
     if(err) throw err;
     var getUserId=data._id;
var getpassword=data.password;
if(bcrypt.compareSync(password,getpassword)){
  var token=jwt.sign({userid:getUserId},'loginToken');
  localStorage.setItem('userToken',token);
  localStorage.setItem('loginUserName',username);
  res.redirect('/dashboard');
}
else
{
  res.render('index',{title:'Employee Management System',msg:'Invalid UserName and Password'});
}
   })
 })
 router.get('/dashboard',checkLoginUser,(req,res,next)=>{
   var loginUser=localStorage.getItem('loginUserName');
res.render('Dashboard',{title:'Password Management System',msg:'',loginUser:loginUser});
 })
 //middleware -1
function checkUsername(req,res,next){
  //res.setHeader("Content-Type", "text/html");
  var username=req.body.uname;
  var checkExistUname=UserModel.findOne({username:username});
  checkExistUname.exec((err,data)=>{
    if(err) throw err;
    if(data){
     return res.render('signup',{title:'Employee Management System',msg:'Username already Exist'});
    }
    next();
  })
}
//middleware -2
function checkEmail(req,res,next){
  var email=req.body.email;
  var checkExistEmail=UserModel.findOne({email:email});
  checkExistEmail.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup',{title:'Employee Management System',msg:'Email already Exist'});
    }
    next();
  })
}
router.get('/signup',(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  if(loginUser)
  {
    res.redirect('/dashboard');
  }
  else{
  res.render('signup',{title:'Employee Management System',msg:''});
  }
})
router.post('/signup',checkUsername,checkEmail,(req,res,next)=>{
  let username=req.body.uname;
   let email=req.body.email;
   let password=req.body.password;
   let conpassword=req.body.confpassword;
   if(password!=conpassword)
   {
    res.render('signup',{title:'Employee Management System',msg:'Password did not matched'});
   }
   else{
    password=bcrypt.hashSync(req.body.password,10);
var userdetails=new UserModel({
  username:username,
  email:email,
  password:password
});
userdetails.save((err,doc)=>{
  if(err) throw err;
    res.render('signup',{title:'Password Management System',msg:'Registered Successfully'});
});
   }
});


router.get('/add-new-category',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  res.render('addNewCategory',{title:'ems',loginUser:loginUser,success:''})
})

router.post('/add-new-category',(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  var password_category=req.body.passwordCategory;
  var passcatDetails=new passwordCategoryModel({
    passwordCategory:password_category
  })
  passcatDetails.save((err,doc)=>{
    if(err) throw err;
    res.render('addNewCategory',{title:'ems',loginUser:loginUser,success:'Password Category Inserted Successfully'})
  })
})

router.get('/passwordCategory',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    res.render('passwordCategory',{title:'ems',loginUser:loginUser,records:data})
  })
 
})

router.get('/passwordCategory/edit/:id',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  var passcat_id=req.params.id;
  var getPassCategory=passwordCategoryModel.findById(passcat_id);
  getPassCategory.exec((err,data)=>{
    if(err) throw err;
    res.render('edit-password-category',{title:'ems',loginUser:loginUser,success:'',records:data})
  })
 
})

router.post('/passwordcategory/edit',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  var password_category=req.body.passwordCategory;
  var pass_cat_id=req.body.id;
  var getPassCategory=passwordCategoryModel.findByIdAndUpdate(pass_cat_id,{passwordCategory:password_category});
  getPassCategory.exec((err,data)=>{
    if(err) throw err;
    res.redirect('/passwordCategory');
  })
 
})

router.get('/passwordCategory/delete/:id',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  var passcat_id=req.params.id;
  var passdelete=passwordCategoryModel.findByIdAndDelete(passcat_id);
  passdelete.exec((err)=>{
    if(err) throw err;
    res.redirect('/passwordCategory');
  })
 
})


router.get('/add-new-password',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  getPassCat.exec((err,data)=>{
    if(err) throw err;
    res.render('addNewPassword',{title:'ems',loginUser:loginUser,records:data,msg:''});
  })
  
})
router.post('/add-new-password',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  var password_category=req.body.pass_cat;
  var Proj_name=req.body.project_name;
  var password_details=req.body.pass_details;
  var passworddata=new passModel({
    password_category:password_category,
    project_name:Proj_name,
    password_details:password_details
  })
  passworddata.save((err,doc)=>{
    getPassCat.exec((err,data)=>{
      if(err) throw err;
      res.render('addNewPassword',{title:'ems',loginUser:loginUser,records:data,msg:'Password Inserted Succesfully'});
    })
  })
})

router.get('/view-all-password',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  var options={
    offset:1,
    limit:3     //per page kitne recrds chaiye
  }

  passModel.paginate({},options).then(function(result){
    console.log(result);
    res.render('view-all-password',{title:'ems',
    loginUser:loginUser,
    records:result.docs,
    current:result.offset,
    pages:Math.ceil(result.total / result.limit)
  });
  });
  // getPassDetails.exec((err,data)=>{
  //   if(err) throw err;
   
  // })
});

router.get('/view-all-password/:page',checkLoginUser, function(req, res, next) {
   
  var loginUser=localStorage.getItem('loginUser');

  var perPage = 3;
  var page = req.params.page || 1;

  getPassDetails.skip((perPage * page) - perPage)
  .limit(perPage).exec(function(err,data){
if(err) throw err;
passModel.countDocuments({}).exec((err,count)=>{    
res.render('view-all-password', { title: 'Password Management System',
loginUser: loginUser,
records: data,
  current: page,
  pages: Math.ceil(count / perPage) 
});
  });
});
});


router.get('/viewPassword/delete/:id',checkLoginUser,(req,res,next)=>{
var getid=req.params.id;
var passwordData=passModel.findByIdAndDelete(getid);
passwordData.exec((err,data)=>{
  if(err) throw err;
  res.redirect('/view-all-password');
})
})

router.get('/viewPassword/edit/:id',checkLoginUser,(req,res,next)=>{
  var loginUser=localStorage.getItem('loginUserName');
  var getid=req.params.id;
  var passwordData=passModel.findById(getid);
  passwordData.exec((err,data)=>{
    console.log(data);
    if(err) throw err;
    getPassCat.exec((err,data1)=>{
      res.render('edit-password-data',{title:'ems',loginUser:loginUser,record:data,records:data1,success:''})
    })
   // console.log(data.password_details)
  })
  })
  router.post('/viewPassword/edit',checkLoginUser,(req,res,next)=>{
    var loginUser=localStorage.getItem('loginUserName');
var id=req.body.id;
var passcat=req.body.pass_cat;
var pass_details=req.body.pass_details;
console.log(pass_details);
var passData=passModel.findByIdAndUpdate(id,{password_category:passcat,password_details:pass_details});
passData.exec((err,data)=>{
  if(err) throw err;
  var getPassDetails=passModel.findById(id);
    getPassDetails.exec(function(err,data){
      console.log(data);
  if(err) throw err;
  getPassCat.exec(function(err,data1){
  res.render('edit-password-data', { title: 'Password Management System',loginUser: loginUser,records:data1,record:data,success:'Password Updated Successfully' });
  });
  });
});
  });
router.get('/logout',(req,res,next)=>{
 localStorage.removeItem('userToken');
 localStorage.removeItem('loginUserName');
 res.redirect('/');
});
module.exports=router;