var express = require('express');
var User = require('../models/user');
var bcrypt = require('bcryptjs');
var lodash = require('lodash');

var router = express.Router();

  router.get('/dashbord', (req, res)=>{
      res.render('dashbord',{
        title : 'dashbord',
        style : 'dashbord.css',
        script : 'dashbordscript.js'
      });
  });

  router.get('/register', (req, res)=>{
    res.render('signup',{
      title : 'Register',
      style : 'home.css',
      script : 'homescript.js',
      success : req.session.success,
      errors : req.session.errors
    });
      req.session.errors = null;
  });

  router.get('/content', (req, res)=>{
      res.render('content',{
        title : 'content',
        style : 'content.css',
        script : 'contentscript.js'
      });
  });

  router.post('/majesty', (req,res)=>{

      var email = req.body.email;
      var password = req.body.password;
      var address1 = req.body.address1;
      var address2 = req.body.address2;
      var city = req.body.city;
      var selectOption = req.body.selectOption;
      var zipCode = req.body.zipCode;

      req.checkBody('email', 'Please Provide Your Email !').notEmpty();
      req.checkBody('password','Please Provide Your Password !').notEmpty();
      req.checkBody('address1','Please Provide Your Address1 !').notEmpty();
      req.checkBody('address2', 'Please Provide Your Address2 !').notEmpty();
      req.checkBody('city', 'Please Provide Your City !').notEmpty();
      req.checkBody('selectOption', 'Select An Option From The Option Menu !').notEmpty();
      req.checkBody('zipCode','Please Provide Your Zip Code !').notEmpty();

      var errors = req.validationErrors();
      if (errors) {
        res.redirect('/register');
        req.session.errors = errors;
        req.session.success = false;
      }else {
        user = new User({
            email : email,
            password : password,
            address1 : address1,
            adress2 : address2,
            city : city,
            selectOption : selectOption,
            zipCode : zipCode
        });
        User.findOne({email : user.email}).then((email)=>{
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
                    user.save().then((doc)=>{
                    var email = _.pick(doc,['email']);
                    var ID = _.pick(doc,['_id']);

                    massage : `Registration Completed, Your Email And Your ID Are ${email} and ${ID}`;

                    },(err)=>{
                      console.log(err);
                    });
                  }
                });
                }
              });
          }else {
            msg : 'Email allready exists';
           //req.session.errors = msg;
          req.session.success = true;
          }
        },(err)=>{
          console.log(`error ${err}`);
        });

      }

  });

module.exports = router;
