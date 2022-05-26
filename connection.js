const express=require('express');
const ejs=require('ejs');
const multer=require('multer');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const app=express();
const PORT=8081;
const mongodbUrl='mongodb://localhost/malvine';

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Connecting to the database
app.connect(mongodbUrl,function(error){
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

//App routes
app.get('/',function(req,res){
    res.render('index',{title:'Node CRUD app'});
});



//server
app.listen(PORT,function(error){
    if(error){
        console.warn('App encountered error:',error);
    }else{
        console.info(`App connected to server via port ${PORT}`);
    }
});