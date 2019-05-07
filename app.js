var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport')
const passportSetup = require('./config/passport-setup')
const jwt = require('jsonwebtoken');
var adminRouter = require('./routes/admin');
var userRouter = require('./routes/users');
var authRouter = require('./routes/auth');
const session = require('express-session')
const FileStore = require('session-file-store')(session);

var app = express();
const User = require('./models').User
const Task = require('./models').Task

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('keyboard cat'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/javascripts',express.static(path.join(__dirname, 'public/javascripts')));
app.use(passport.initialize());

app.use(session({
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.session());
app.use('/auth', authRouter);
app.use(checkTokens)

app.use('/', userRouter);

app.use('/admin', adminRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function checkTokens(req,res,next) {
  console.log('checking for tokens ',req.session);
  if(req.session.passport===undefined){
    console.log('no user');
    return res.render('login')
  }else if (req.session.passport.user.accessToken===undefined) {
    console.log('probably oauth');
    return next()
  }else {
    jwt.verify(req.session.passport.user.accessToken,'secretkey',(err,authData)=>{
      if(err){
        //res.render('login');
        console.log(err.message);
        if(err.message=='jwt expired'){
          checkRT()
        }

      }else {
        console.log("access for jwt user granted",authData)
        //console.log('AT expires in : ' ,authData.exp-Date.now());
        next()
      }
    })

  }

  function checkRT() {
    console.log('checking RT');

    User.findOne({where:{id:req.session.passport.user.id},attributes:['refreshToken']})
    .then((val)=>{
      let rt= val.dataValues.refreshToken;
      //console.log(rt);
      if(rt === req.session.passport.user.refreshToken){
        jwt.verify(rt,'anotherSecretkey',(err,authData)=>{
          if(err){
            console.log(err.message);
            if(err.message=='jwt expired'){
              return res.render('login')
            }

          }else {
            console.log("new accessToken ")
            // sign new AT
            const at = jwt.sign(authData.usr,"secretkey",{expiresIn:10})
            req.session.passport.user.accessToken=at
            return next()
          }
        })
      }else{
        console.log(rt === req.session.passport.user.refreshToken);
        console.log('tokens dont match');
        return res.render('login')
      }
    })
  }
}

module.exports = app;
