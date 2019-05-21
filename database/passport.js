const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// load Users

const User = require('../models/user');

module.exports = function(passport){
    passport.use('user', new LocalStrategy({usernameField : 'userName',
    passwordField: 'password'},(userName,password,done)=>{
        User.findOne({email: userName},(err,user)=>{
            if(err){
                return console.log(`Error ${err}`);
            } 
            if(!user){
                return done(null,null,{message:'User Not Registered'});
            }
            bcrypt.compare(password,user.password,(err,isMatch)=>{
                if(err){
                    return console.log(`Error ${err}`);
                }
                if(!isMatch){
                    return done(null,null,{message : 'Incorrect Password'});
                }
                return done(null,user);
            });
        });
    }));   
passport.serializeUser(function(user,done){
    done(null,user.id);
});
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
    done(err,user);
    });
});

} 