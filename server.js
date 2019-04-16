  var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash-plus');


var user = require('./routes/user');
var {config} = require('./database/mongoose');

var PORT =  process.env.PORT || 3000;

var app = express();
mongoose.connect(config,{
    useNewUrlParser: true
});

const conn = mongoose.connection;

conn.once('open', () => {
    console.log('Database Connection Established Successfully.');
});

conn.on('error', (err) => {
    console.log('Unable to Connect to Database. ' + err);
});

app.use(express.static(__dirname + 'static'));
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: 'views/partials',
}));
app.set('view engine', '.hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({secret: 'majesty', saveUninitialized: true, resave: false}));
app.use(flash());
app.use((req,res,next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.get('/', function(req,res){
    res.render('home',{
      title : 'Home',
      style : 'homecss.css',
      script : 'homescript.js'
    });
});

app.use('/user',user);

app.listen(PORT, ()=>{
  console.log(`Application Is On  @ Port ${PORT}`);
});
