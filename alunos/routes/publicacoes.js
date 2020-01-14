var express = require('express');
var router = express.Router();
const fs = require('fs')
var Publicacoes = require('../controllers/publicacoes')
var Publicacao = require('../models/publicacoes')


router.get('/', function (req, res) {
    Publicacoes.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

router.get('/:gid', function (req, res) {
    Publicacoes.filtar(req.params.gid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

router.post('/', function (req, res) {
    Publicacoes.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(e => res.status(500).jsonp(e))
})

module.exports = router;
