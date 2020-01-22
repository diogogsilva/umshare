var Publicacao = require('../models/publicacoes')

// listar todos

module.exports.listar = () => {
    return Publicacao
        .find()
        .exec()
}

// Listar por grupo

module.exports.filtrarPorGrupo = grupoid => {
    return Publicacao
        .findOne({ grupo: grupoid })
        .exec()
}

// Listar por utilizador

module.exports.filtrarPorUser = utilizadorid => {
    return Publicacao
        .find({ utilizador: utilizadorid })
        .exec()
}

// Listar por metadata?

// Inserção de publicação

module.exports.inserir = pub => {
    var novo = new Publicacao(pub)
    return novo.save()
}

// Inserção de comentário