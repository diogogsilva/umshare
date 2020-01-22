var Publicacao = require('../models/publicacoes')
var Comentario = require('../models/publicacoes')

// listar todos

module.exports.listar = () => {
    return Publicacao
        .find()
        .exec()
}

module.exports.filtrar = pid => {
    return Publicacao
        .findOne({ _id: pid })
        .exec()
}

// Listar por grupo


module.exports.filtrar_grupo = grupoid => {
    return Publicacao
        .findOne({ grupo: grupoid })
        .exec()
}

// Listar por utilizador

module.exports.filtrar_utilizador = utilizadorid => {
    return Publicacao
        .find({ utilizador: utilizadorid })
}

// Listar por metadata?

module.exports.filtrar_metadata = md => {
    return Publicacao
        .aggregate(
            [{ $unwind: "$metadata" }, { $match: { 'metadata': { $regex: md, $options: 'i' } } }]
        )
}

// Inserção de publicação

module.exports.inserir = pub => {
    var novaPublicacao = new Publicacao(pub)
    return novaPublicacao.save()
}

// Inserção de comentário

module.exports.adicionarComentario = (com, pubid) => {
    return Publicacao
        .findOneAndUpdate({ "_id": pubid }, { $push: { "comentarios": com } })
}

module.exports.removerComentario = (comid, pubid) => {
    return Publicacao
        .update({ "_id": pubid }, { $pull: { "comentarios": comid } })
}

