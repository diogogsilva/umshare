var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')
var bcrypt = require('bcryptjs')


/* GET home page. */
/*router.get('/', function(req, res) {
  res.render('login');
});*/
router.get('/', verificaAutenticacao, function(req, res) {
  /*axios.get('http://localhost:5003')
    then(dados => res.render('index', {lista: dados.data}))
    .catch(e => res.render('error', {error: e}))*/
    res.redirect('/feed')
    
});

router.get('/feed', verificaAutenticacao, function(req, res) {
  axios.get('http://localhost:5003/publicacoes/user/' + req.user.email)
    .then(dados => res.render('index', {publicacoes: dados.data}))
    .catch(erro => console.log(erro))
});

/*router.get('/register', function(req, res) {
  res.render('register');
});*/



router.get('/logout', verificaAutenticacao, function(req,res){
  req.logout()
  res.redirect('/')
})

router.get('/login', function(req,res){
  res.render('login')
})

router.get('/register', function(req,res){
  res.render('register')
})

router.post('/login', passport.authenticate('local', 
  { successRedirect: '/',
    successFlash: 'Utilizador autenticado com sucesso!',
    failureRedirect: '/',
    failureFlash: 'Utilizador ou password inválido(s)...'
  })
)

router.post('/reg', function(req,res){
  var hash = bcrypt.hashSync(req.body.password, 10);
  axios.post('http://localhost:5003/utilizadores', {
    email: req.body.email,
    nome: req.body.nome,
    password: hash
  })
    .then(dados => res.redirect('/'))
    .catch(e => res.render('error', {error: e}))
})

function verificaAutenticacao(req,res,next){
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
    console.log("verificou a autenticação!")
    //res.redirect("/feed");
    next();
  } else{
    console.log("não verificou a autenticação!")
    res.redirect("/login");}
}

module.exports = router;
