var express = require('express');
var router = express.Router();
var Conversas = require('../controllers/conversas')

router.get('/', function(req, res) {
  Conversas.listar(req.query.email)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

router.post('/', function(req,res) {
    Conversas.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(e => res.status(500).jsonp(e))
})

router.post('/mensagem', function(req,res) {
  console.log(req.body)
  var data = new Date();
  //req.body.cid = '5e30e110f6bb85144c00cf10';
  Conversas.criarMensagensParaConversa(req.body.cid, req.body.mensagem, req.body.utilizadorRemetente, data.toISOString())
      .then(dados => res.jsonp(dados))
      .catch(e => res.status(500).jsonp(e))
})

router.get('/:id', function(req, res) {
  Conversas.listarConversasPorID(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(e => res.status(500).jsonp(e))
});

module.exports = router;