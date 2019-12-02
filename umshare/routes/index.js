var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('login');
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

router.get('/register', function(req, res) {
  res.render('register');
});

module.exports = router;
