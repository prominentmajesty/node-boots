var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({

email : {
  type : String,
  required : true
},

password : {
  type : String,
  required : true
},

address1 : {
  type : String,
  required : true
},

address2 : {
  type : String,
  required : true
},

city : {
  type : String,
  required : true
},

zipCode : {
  type : String,
  required : true
}

});

module.exports = User1 = mongoose.model('User1',UserSchema);
