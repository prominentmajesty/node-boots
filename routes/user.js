var express = require('express');
var User1 = require('../models/user');
var bcrypt = require('bcryptjs');
var _ = require('lodash');
//var {ObjectID} = require('mongodb');
var passport = require('passport');
//const Unsplash = require('unsplash-js').default

var router = express.Router();

  router.get('/dashbord', (req, res)=>{
      res.render('dashbord',{
        title : 'dashbord',
        style : 'dashbord.css',
        script : 'dashbordscript.js'
      });
  });

  router.get('/content', (req, res)=>{
      res.render('content',{
        title : 'content',
        style : 'content.css',
        script : 'contentscript.js'
      });
  });
  router.get('/signup', (req, res)=>{
    res.render('signup',{
      title : 'Register',
      style : 'home.css',
      script : 'homescript.js'
    });
  });

  router.get('/login',(req,res)=>{
    res.render('login',{
      title : 'Register',
      style : 'home.css',
      script : 'homescript.js'
    });
  });
  
  router.get('/update',(req,res)=>{
    res.render('update',{
      title : 'Register',
      style : 'home.css',
      script : 'homescript.js'
    });
  });

  router.post('/signup', (req,res)=>{

      var email = req.body.email;
      var password = req.body.password;
      var address1 = req.body.address1;
      var address2 = req.body.address2;
      var city = req.body.city;
      var zipCode = req.body.zipCode; 

      req.checkBody('email', 'Please Provide Your Email !').notEmpty();
      req.checkBody('password','Please Provide Your Password !').notEmpty();
      req.checkBody('address1','Please Provide Your Address1 !').notEmpty();
      req.checkBody('address2', 'Please Provide Your Address2 !').notEmpty();
      req.checkBody('city', 'Please Provide Your City !').notEmpty();
      req.checkBody('zipCode','Please Provide Your Zip Code !').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        req.session.errors = errors;
        res.render('signup',{
          errors : req.session.errors,
          email:email,
          password : password,
          address1 : address1,
          address2 : address2,
          city : city,
          zipCode : zipCode
        });
      }else {
        user = new User1({
            email : email,
            password : password,
            address1 : address1,
            address2 : address2,
            city : city,
            zipCode : zipCode
        });
        User1.findOne({email : user.email}, (err,email)=>{
          if(err){
            return console.log(err);
          }
          if(!email){
            bcrypt.genSalt(10, (err,salt)=>{
              if(err){
                console.log(err);
              }else {
              bcrypt.hash(user.password,salt, (err, hash)=>{
                if(err){
                  console.log(`Error : ${err}`);
                }else{
                  user.password = hash;
                  user.save((err,doc)=>{
                    var mail = doc.email;
                    var IDD = doc._id;
                     req.flash('success_msg',`Registration Completed, Your Email is : ${mail} And Your ID is : ${IDD}`);
                    res.redirect('/user/signup');
                  });
                }
              });
            }
            });
        }else {
          var ashL = email.email;
            req.flash('error_msg',`the email ${ashL} has Already Been Taking By Another User`);
          res.redirect('/user/signup');
        }
      });
        }
  });

  router.post('/dashbord', function(req,res){
    var submitText =  req.body.submitText;
    req.checkBody('submitText','').notEmpty();

    var errors = req.validationErrors();
    if(errors){
      req.flash('error_msg','Empty TextField !!!');
          res.redirect('/user/dashbord');
       }else{//
              User1.findOne({_id : submitText}, function(err,doc){
                if(!doc){
                  req.flash('error_msg',`The ID ${submitText} You Entered Is An Invalid ID`);
                  res.redirect('/user/dashbord');
                }else{
                  res.render('dashbord',{
                      email : doc.email,
                      password : doc.password,
                      address1 : doc.address1,
                      address2 : doc.address2,
                      city : doc.city,
                      zipcode : doc.zipCode
                  });
                }
              });
         }//
  });

  router.post('/update',(req,res)=>{
      var email = req.body.email;
      var password = req.body.password;
      var newPassword = req.body.newPassword;
      var renterNewPassword = req.body.renterNewPassword;

      req.checkBody('email','Your Required To Provide Your Email Address').notEmpty();
      req.checkBody('password','Your Required To Privide Your Password').notEmpty();
      req.checkBody('newPassword','Type The New Password To Be Changed To').notEmpty();
      req.checkBody('renterNewPassword','Please Re-Enter Your New Password').notEmpty();
      req.checkBody('renterNewPassword','Password Does Not Match!! Make Sure You Type A Matched Password').equals(newPassword); 
      
      var errors = req.validationErrors();
      if(errors){
        req.session.errors = errors;
        res.render('update',{
          title : 'Register',
          style : 'home.css',
          script : 'homescript.js',
          errors : req.session.errors
        });
      }else{
        User1.findOne({email: email},(err,doc)=>{
          if(err){
            return res.status(401).send();
          }
          if(!doc){
            req.flash('error_msg','Your Email Address Is Wrong !!');
            res.redirect('/user/update');
          }else{
            bcrypt.compare(password,doc.password,(err,isMatch)=>{
              if(err){
                return console.log(`${err}`);
              }
              if(!isMatch){
                console.log('Error'+ err);
                req.flash('error_msg','Wrong Password, Please Enter A Valid Password !!');
                res.redirect('/user/update');
              }else{
                bcrypt.genSalt(10,(err, salt)=>{
                  if(err){
                    console.log(`Error : ${err}`);
                  }else{
                    bcrypt.hash(renterNewPassword,salt,(err,hash)=>{
                      if(err){
                        return console.log(`Error : ${err}`);
                      }
                      const password = {newPassword: hash};
                      User1.findOneAndUpdate({email: email},{$set: password},{new: true, useFindAndModify: false},(err,newDoc)=>{
                        if(err){
                          console.log(`Error:${err}`);
                          res.status(401).send();
                        }else{
                          req.flash('success_msg',`Password Successfuly Changed Your New Password Is Now ${req.body.password}`);
                          res.redirect('/user/update');
                        }
                      });
                    });
                  }
                });
              }
            });
          }
        });
      } 
  });

  router.post('/remove', (req,res)=>{
     var remove = req.body.delete; 
      req.checkBody('delete','').notEmpty();
      var error = req.validationErrors();
      if(error){
        req.flash('error_msg','Empty TextField Please Provide The ID You Want Its Document To Be Deleted !!!');
        res.redirect('/');
      }else{
        User1.findOneAndDelete({_id: remove},(err,fdBack)=>{
          if(err){
            return console.log(`Error:${err}`);
          }
           if(!fdBack){
             req.flash('error_msg',`Failed To Delete The Content Of The ID ${remove}!! Reason Invalid ID`);
             res.redirect('/');
           } else{
             req.flash('success_msg',`Success !!! The Content Of The ID ${fdBack._id} Is Successfuly Deleted`);
             res.redirect('/');
           }
        });
      }
  });
 
  router.post('/signIn',(req,res,next)=>{
    passport.authenticate('user',{
      successRedirect:'/user/dashbord',
      failureRedirect:'/user/login',
      failureFlash:true
    })(req,res,next);
  });

module.exports = router;
 