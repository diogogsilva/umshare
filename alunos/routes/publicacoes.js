var express = require('express');
var router = express.Router();
const fs = require('fs')
var Publicacoes = require('../controllers/publicacoes')
var Publicacao = require('../models/publicacoes')
var Ficheiro = require('../models/ficheiros')


var multer = require('multer')
var upload = multer({ dest: 'uploads/' })


router.get('/', function (req, res) {
    Publicacoes.listar()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

router.get('/:gid', function (req, res) {
    Publicacoes.filtrarPorGrupo(req.params.gid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

router.get('/user/:uid', function (req, res) {
    Publicacoes.filtrarPorUser(req.params.uid)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

router.post('/', upload.array('ficheiro'), function (req, res) {
    //console.log(req.files)
    //console.log(req.body)

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

module.exports = router;
