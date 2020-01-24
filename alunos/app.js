var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/umshare-Alunos', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Servidor Mongo da API do UMShare a correr...'))
  .catch((erro) => console.log('Mongo: erro na conexão: ' + erro))

var eventosRouter = require('./routes/eventos');
var utilizadoresRouter = require('./routes/utilizadores');
var ficheirosRouter = require('./routes/ficheiros');
var publicacoesRouter = require('./routes/publicacoes');
var gruposRouter = require('./routes/grupos');

//atutenticação com JWT
var passport = require('passport')
var JWTStrategy = require('passport-jwt').Strategy
var ExtraJWT = require('passport-jwt').ExtractJwt

var extractFromQS = function (req) {
  var token = null
  if (req.query && req.query.token) token = req.query.token
  return token
}

var extractFromBody = function (req) {
  var token = null
  if (req.body && req.body.token) token = req.body.token
  return token
}

passport.use(new JWTStrategy({
  secretOrKey: 'umshare',
  jwtFromRequest: ExtraJWT.fromExtractors([extractFromQS, extractFromBody])
}, async (payload, done) => {
  try {
    return done(null, payload)
  } catch (error) {
    return done(error)
  }
}))

var app = express();

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/eventos', eventosRouter)
app.use('/utilizadores', utilizadoresRouter);
app.use('/ficheiros', publicacoesRouter);
app.use('/publicacoes', publicacoesRouter);
app.use('/grupos', gruposRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
