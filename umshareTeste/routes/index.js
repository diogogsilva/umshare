var express = require('express');
var router = express.Router();
var axios = require('axios')
var passport = require('passport')
var bcrypt = require('bcryptjs')

router.get('/', verificaAutenticacao, function(req, res) {
    res.render('index')
});

router.get('/feed', verificaAutenticacao, function(req, res) {
  axios.get('http://localhost:5003/publicacoes?utilizador=' + req.user.email)
    .then(dados => res.json(dados.data))
    .catch(erro => console.log(erro))
});

router.get('/grupos', verificaAutenticacao, function(req, res) {
  axios.get('http://localhost:5003/grupos')
    .then(dados => res.json(dados.data))
    .catch(erro => console.log(erro))
});

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

/*router.post('/login', passport.authenticate('local'), function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.jsonp({"status": "ok","msg":"Login com sucesso!"})
  }
);*/
router.post('/login', passport.authenticate('local', {
  successRedirect: '/login',
  successFlash: 'Utilizador autenticado com sucesso!',
  failureRedirect: '/erro',
  failureFlash: 'Utilizador ou password inválido(s)...'
  })
)
  /*{ successRedirect: '/',
    successFlash: 'Utilizador autenticado com sucesso!',
    failureRedirect: '/login',
    failureFlash: 'Utilizador ou password inválido(s)...'
  })
)*/

router.post('/reg', function(req,res){
  var hash = bcrypt.hashSync(req.body.password, 10);
  axios.get('http://localhost:5003/utilizadores/verify/' + req.body.email)
    .then(dados => {
      if(dados.data != undefined) {
        res.jsonp({"status": "erro","msg":"Email já em uso!"})
      } else {
        axios.post('http://localhost:5003/utilizadores', {
          email: req.body.email,
          nome: req.body.nome,
          password: hash
        })
        .then(dados => res.redirect("/login"))//res.jsonp({"status": "ok","msg":"Registado com sucesso!"}))
        .catch(e => res.render('error', {error: e}))
      }
    })
})

function verificaAutenticacao(req,res,next){
  if(req.isAuthenticated()){
    console.log("verificou a autenticação!")
    next();
  } else{
    console.log("não verificou a autenticação!")
    res.redirect("/login");}
}

module.exports = router;
