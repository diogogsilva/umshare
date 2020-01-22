var express = require('express');
var router = express.Router();
const fs = require('fs')
var Publicacoes = require('../controllers/publicacoes')
var Publicacao = require('../models/publicacoes')
var Ficheiro = require('../models/ficheiros')
var Comentario = require('../models/comentarios')

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })


// Obter publicações por id

router.get('/:id', function (req, res) {
    Publicacoes.filtar(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

// GET PUBLICAÇÕES

router.get('/', function (req, res) {
    if (req.query.utilizador) {
        Publicacoes.filtrar_utilizador(req.query.utilizador)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    } else if (req.query.grupo) {
        Publicacoes.filtrar_grupo(req.query.grupo)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    } else if (req.query.metadata) {
        Publicacoes.filtrar_metadata(req.query.metadata)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
    else {
        Publicacoes.listar()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
})

// INSERÇÃO DE PUBLICAÇÃO

router.post('/', upload.array('ficheiro'), function (req, res) {

    var ficheiros = []
    var data = new Date()
    var metad = req.body.metadata.split(',')

    if (req.files.length > 0) {
        for (var i = 0; i < req.files.length; i++) {
            let novoFicheiro = new Ficheiro(
                {
                    dataupload: data.toISOString(),
                    designacao: req.files[i].originalname,
                    mimetype: req.files[i].mimetype,
                    size: req.files[i].size
                })
            ficheiros.push(novoFicheiro)
        }
    }
    let novaPublicacao = new Publicacao(
        {
            conteudo: req.body.conteudo,
            ficheiros: ficheiros,
            tipo: "?",
            utilizador: "123",
            metadata: metad,
            grupo: "123",
            data: data.toISOString()
        })
    //console.log(ficheiros)
    Publicacoes.inserir(novaPublicacao)
        .then(dados => {
            if (req.files.length > 0) {
                fs.mkdir(
                    __dirname + "/../public/ficheiros/" + dados._id,
                    {
                        recursive: true,
                        mode: 0o77
                    },
                    err => {
                        if (err) {
                            throw err;
                        }
                        console.log("Diretoria " + dados._id + " criada");
                    }
                );
                for (var i = 0; i < req.files.length; i++) {
                    let oldPath = __dirname + '/../' + req.files[i].path
                    let newPath = __dirname + "/../public/ficheiros/" + dados._id + '/' + req.files[i].originalname

                    fs.rename(oldPath, newPath, function (err) {
                        if (err) throw err
                    })
                }
            }
            else {
                console.log("Qualquer coisa")
            }
            res.redirect("http://localhost:2222/feed")
        })
        .catch(e => res.status(500).jsonp(e))
})
/*
    novoFicheiro.save(function (err, ficheiro) {
        if (!err) console.log('Ficheiro guardado com sucesso!')
        else console.log('ERRO: ' + err)
    })

*/

// Adição de Comentário

router.post('/adicionarComentario', function (req, res) {
    if (req.body.pubid != undefined) {
        var date = new Date();

        var comentario = new Comentario(
            {
                conteudo: req.body.conteudo,
                utilizador: req.body.utilizadorid,
                data: date.toISOString()
            })
        console.log(comentario)

        Publicacoes.adicionarComentario(comentario, req.body.pubid)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.status(500).jsonp({ "status": "erro", "msg": "Ups, algo correu mal!" })
    }
})


// Remove comentário

router.post('/removeComentario', function (req, res) {
    if (req.body.comid != undefined && req.body.pubid != undefined) {
        Publicacoes.removerComentario(req.body.comid, req.body.pubid)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.status(500).jsonp({ "status": "erro", "msg": "Ups, algo correu mal!" })
    }
})

module.exports = router;
