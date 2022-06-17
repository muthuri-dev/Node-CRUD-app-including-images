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
/*
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const ejs = require('ejs');
const mongoose = require('mongoose');
const port = 8082;
const mongoUrl = 'mongodb://localhost/malvine2';
const images = require('./models/model.js');
const fs = require('fs');
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Enablic public files
app.use(express.static('public'));
app.use(express.static('uploads'));

//Setting templating engine
app.set('view engine', 'ejs');

//Connecting to mongodb database
mongoose.connect(mongoUrl, function(error) {
    if (error) {
        console.warn('Database encountered error: ' + error);
    } else {
        console.info('App connected to the database');
    }
});

//Image upload using multer
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    }, //it will upload the file to the build app in the upload directory
    //if you delete it images won't get retrieved to the front-end 
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
//middleware
var upload = multer({
    storage: storage,
});

//Creating routes && Getting images from the database
app.get('/', function(req, res) {
    images.find({}, function(error, imagess) {
        res.render('index', {
            title: 'Uploading files to the database',
            imagesList: imagess,
        });
    });
});
//
//Inserting to database
app.post('/upload', upload.single('image'), function(req, res) {
    const newImages = new images({
        name: req.body.name,
        image: req.file.filename,
    });
    newImages.save();
    console.info(newImages);
    res.redirect('/');
});
//deleting images
app.get('/delete/:id', function(req, res) {
    let id = req.params.id;
    images.findByIdAndRemove(id, function(error, results) {
        if (results.image != " ") {
            try {
                fs.unlinkSync('./uploads/' + results.image);
            } catch (error) {
                console.warn(error);
            }
        }
        res.redirect('/');
    })
});
//Creating server
app.listen(port, function(error) {
    if (error) {
        console.warn('App server error: ' + error);
    } else {
        console.info(`App connected to port ${port}`);
    }
});*/