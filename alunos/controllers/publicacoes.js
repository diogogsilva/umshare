var Publicacao = require('../models/publicacoes')

// listar todos

module.exports.listar = () => {
    return Publicacao
        .find()
        .exec()
}

// Listar por grupo

module.exports.filtrar = grupoid => {
    return Publicacao
        .findOne({ grupo: grupoid })
        .exec()
}

// Listar por utilizador

module.exports.filtrar = utilizadorid => {
    return Publicacao
        .findOne({ utilizador: utilizadorid })
        .exec()
}

// Listar por metadata?

// Inserção de publicação

module.exports.inserir = pub => {
    var novo = new Publicacao(pub)
    return novo.save()
}

// Inserção de comentário