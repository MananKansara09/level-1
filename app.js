require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const port = 3000;




mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PASSWORD}@cluster0.dxifr.mongodb.net/?retryWrites=true&w=majority`).then(()=>{
    console.log("Your database connection succesfully!")
}).catch((err)=>{
    console.log(err.message);
})





const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

 





const User = new mongoose.model("User",userSchema);




const app = express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));



app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});


app.get("/register",(req,res)=>{
    res.render("register");
});


app.post("/register",function(req,res){
  
    bcrypt.hash(req.body.password,15,function(err,hash){
        if(err){
            console.log(err.message);

        }else{
            const NewUser = new User({
                email : req.body.username,
                password : hash
            })
        
            NewUser.save(function(err){
                if(err){
                    console.log(err.message);
                }
                else{
                    res.render('secret');
                }
            })

        }
        

    })



    
});



app.post("/login",function(req,res){
    
 

    User.findOne({email : req.body.username},function(err,foundUser){
        if(err){
            console.log(err.message);
            res.render("login",{err})
        }else{
            if(foundUser){
                bcrypt.compare(req.body.password,foundUser.password,function(err,resault){
                    if(err){
                        console.log(err.message)
                    }
                    if(resault === true){
                        res.render("secret")
                    }

                })
                   
                }
            }
        
    })
});

app.listen(port,()=>{
    console.log(`Your server is running at ${port} and location:- http://localhost:${port}/`)
})