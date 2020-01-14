var Publicacao = require('../models/publicacoes')
module.exports.listar = () => {
    return Publicacao
        .find()
        .exec()
}

module.exports.filtrar = grupo => {
    return Publicacao
        .findOne({ grupo: grupo })
        .exec()
}

module.exports.inserir = pub => {
    var novo = new Publicacao(pub)
    return novo.save()
}