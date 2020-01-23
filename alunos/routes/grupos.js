var express = require('express');
var router = express.Router();
const fs = require('fs')
var Grupos = require('../controllers/grupos')
var Grupo = require('../models/grupos')

router.get('/', function (req, res) {
    Grupos.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

router.get('/:gid/membros', function (req, res) {
    Grupos.listarMembros(req.params.gid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

router.post('/', function (req, res) {
    Grupos.inserir(req.body)
        .then(dados => res.jsonp(dados))
        .catch(e => res.status(500).jsonp(e))
})

router.post('/addMembro', function (req, res) {
    if (req.body.gid != undefined && req.body.idMembro != undefined) {
        Grupos.adicionarMembro(req.body.gid, req.body.idMembro)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.status(500).jsonp({ "status": "erro", "msg": "Ups, algo correu mal!" })
    }
})

router.post('/removeMembro', function (req, res) {
    if (req.body.gid != undefined && req.body.idMembro != undefined) {
        Grupos.removerMembro(req.body.gid, req.body.idMembro)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.status(500).jsonp({ "status": "erro", "msg": "Ups, algo correu mal!" })
    }
})

router.post('/updateNome', function (req, res) {
    if (req.body.gid != undefined && req.body.nome != undefined) {
        Grupos.updateDescricao(req.body.gid, req.body.nome)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.status(500).jsonp({ "status": "erro", "msg": "Ups, algo correu mal!" })
    }
})

router.post('/updateDescricao', function (req, res) {
    if (req.body.gid != undefined && req.body.descricao != undefined) {
        Grupos.updateDescricao(req.body.gid, req.body.descricao)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.status(500).jsonp({ "status": "erro", "msg": "Ups, algo correu mal!" })
    }
})

module.exports = router;