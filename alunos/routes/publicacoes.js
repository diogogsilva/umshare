var express = require('express');
var router = express.Router();
const fs = require('fs')
var Publicacoes = require('../controllers/publicacoes')
var Publicacao = require('../models/publicacoes')
var Ficheiro = require('../models/ficheiros')
var Comentario = require('../models/comentarios')
var passport = require('passport')

var multer = require('multer')
var upload = multer({ dest: 'uploads/' })


// GET file

router.get('/getFicheiro', function (req, res) {
    console.log(req.query)

    const file = __dirname + "/../public/ficheiros/" + req.query.pubid + '/' + req.query.fileName;
    console.log(file)
    res.download(file)

})

// Tags das  pubs

router.get('/tags', function (req, res) {
    Publicacoes.listar_tags("")
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

// Obter publicação por id

router.get('/:id', function (req, res) {
    Publicacoes.filtrar(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
})

// GET PUBLICAÇÕES

router.get('/', function (req, res) {
    if (req.query.metadata) {
        if (req.query.metadata == "semmd") {
            Publicacoes.filtrar_pubs_metadata("")
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
        } else {
            Publicacoes.filtrar_pubs_metadata(req.query.metadata)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
        }
    } else if (req.query.utilizador) {
        Publicacoes.filtrar_utilizador(req.query.utilizador)
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    } else if (req.query.grupo) {
        if (req.query.grupo == 'semgrupo') {
            Publicacoes.filtrar_sem_grupo(req.query.grupo)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
        } else {
            Publicacoes.filtrar_grupo(req.query.grupo)
                .then(dados => res.jsonp(dados))
                .catch(erro => res.status(500).jsonp(erro))
        }
    } else {
        Publicacoes.listar()
            .then(dados => res.jsonp(dados))
            .catch(erro => res.status(500).jsonp(erro))
    }
})


// INSERÇÃO DE PUBLICAÇÃO

router.post('/', upload.array('ficheiro'), function (req, res) {
    //console.log(req.files)
    var data = new Date()
    req.body.metadata = req.body.metadata.toLowerCase()
    var metad = req.body.metadata.split(',')

    for (var i = 0; i < metad.length; i++) {
        metad[i] = metad[i].trim()
    }

    console.log(metad)

    if (req.files.length > 0) {
        var ficheiros = []
        var filesNameArray = []
        for (var i = 0; i < req.files.length; i++)
            filesNameArray.push(req.files[i].originalname)
        for (var i = 0; i < req.files.length; i++) {
            if (hasDuplicates(filesNameArray)) {
                res.jsonp({ "status": "erro", "msg": "Não pode inserir 2 ficheiros com o mesmo nome!" })
            } else {

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
    }
    let novaPublicacao = new Publicacao(
        {
            conteudo: req.body.conteudo,
            ficheiros: ficheiros,
            tipo: "?",
            utilizador: req.body.utilizador,
            metadata: metad,
            grupo: req.body.grupo,
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
                        mode: 0o777
                    },
                    err => {
                        if (err) {
                            throw err;
                        }
                        res.jsonp({ "status": "ok", "msg": "Inserido com sucesso!" })
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
                res.jsonp({ "status": "ok", "msg": "Inserido com sucesso!" })
            }
        })
        .catch(e => res.jsonp({ "status": "erro", "msg": e }))
})
/*
    novoFicheiro.save(function (err, ficheiro) {
        if (!err) console.log('Ficheiro guardado com sucesso!')
        else console.log('ERRO: ' + err)
    })

*/

// Remover publicação 

router.delete('/:id', function (req, res) {
    Publicacoes.remover(req.params.id)
        .then(dados => res.jsonp(dados))
        .catch(e => res.status(500).jsonp(e))
})

// Adição de Comentário

router.post('/adicionarComentario', function (req, res) {
    // if ?? 
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

router.post('/removerComentario', function (req, res) {
    console.log(req.body)
    if (req.body.comid != undefined && req.body.pubid != undefined) {
        Publicacoes.removerComentario(req.body.comid, req.body.pubid)
            .then(dados => res.jsonp(dados))
            .catch(e => res.status(500).jsonp(e))
    } else {
        res.status(500).jsonp({ "status": "erro", "msg": "Ups, algo correu mal!" })
    }
})


function hasDuplicates(a) {
    for (var i = 0; i <= a.length; i++) {
        for (var j = i; j <= a.length; j++) {
            if (i != j && a[i] == a[j]) {
                return true;
            }
        }
    }
    return false;
}



module.exports = router;
