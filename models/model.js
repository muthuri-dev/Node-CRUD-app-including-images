const mongoose=require('mongoose');
const schema=mongoose.Schema;
const dataSchema=new schema({
    name:{
        type:String,
        required:true,
        trim:true,
        max:64
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:Number,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true,
        default:Date.now
    }
});

const userData=mongoose.model('userData',dataSchema);
module.exports=userData;
/*
const mongoose=require('mongoose');
const schema=mongoose.Schema;

//Creating collection and model
const imageCrudSchema=new schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true,
        default:Date.now
    }
});
const images=mongoose.model('images',imageCrudSchema);

//Exporting the model
module.exports=images;*/