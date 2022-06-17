const express=require('express');
const ejs=require('ejs');
const multer=require('multer');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const app=express();
const PORT=8085;
const mongoUrl = 'mongodb://localhost/malvine';
const userData=require('./models/model.js');
//const { findSeries } = require('async');
const fs=require('fs');
const path=require('path');

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
});
var uploads=multer({
    storage:storage
})

//Connecting to the database
mongoose.connect(mongoUrl,function(error){
    if(error){
        console.warn('Database connection error: ',error);
    }else{
        console.info('App established connection to local database');
    }
});

//view engine
app.set('view engine','ejs');

//public folder
app.use(express.static('public'));
app.use(express.static('uploads'));

//App routes
app.get('/home',function(req,res){

    userData.find({},function(error,details){
        res.render('home',{
        title:'node auth',
        data:details
    })});
});
app.post('/upload',uploads.single('image'),function(req,res){
    const newData=new userData({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        image: req.file.filename,
        text:req.body.text
    });
    newData.save();
    console.log(newData);
    res.redirect('home');
});
app.get('/',function(req,res){
    res.render('index',{title:'node Auth'});
})

app.get('/delete/:_id',function(req,res){
    var id=req.params._id
    userData.findByIdAndRemove({id,function(error,result){
        if(result.file !=" "){
            try{
                fs.unlinkSync('./uploads/'+result.file);
            }catch(error){
                console.log(error);
            }
        }else{
            res.redirect('home');
        }
    }});
});


//server
app.listen(PORT,function(error){
    if(error){
        console.warn('App encountered error:',error);
    }else{
        console.info(`App connected to server via port ${PORT}`);
    }
});
