var Publicacao = require('../models/publicacoes')
module.exports.listar = () => {
    return Publicacao
        .find()
        .exec()
}

module.exports.filtrarPorUser = id => {
    return Publicacao
        .find({utilizador: id})
        .exec()
}

module.exports.filtrarPorGrupo = grupo => {
    return Publicacao
        .findOne({ grupo: grupo })
        .exec()
}

module.exports.inserir = pub => {
    var novo = new Publicacao(pub)
    return novo.save()
}