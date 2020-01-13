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
  axios.get('http://localhost:5003')
    .then(dados => res.render('index', {lista: dados.data}))
    .catch(e => res.render('error', {error: e}))
});

router.get('/feed', function(req, res) {
  var publicacao = {"nome": "Publicacao1", "descricao": "Descricao Publicacao 1", "data": "02/12/2019 21:40"}
  var publicacao2 = {"nome": "Publicacao2", "descricao": "Descricao Publicacao 2", "data": "30/09/2019 15:20"}
  var publicacao3 = {"nome": "Publicacao3", "descricao": "Descricao Publicacao 3", "data": "12/07/2019 9:15"}
  var listaPublicacoes = []
  listaPublicacoes.push(publicacao)
  listaPublicacoes.push(publicacao2)
  listaPublicacoes.push(publicacao3)
  res.render('index', {publicacoes: listaPublicacoes});
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
    next();
  } else{
    res.redirect("/login");}
}

module.exports = router;
