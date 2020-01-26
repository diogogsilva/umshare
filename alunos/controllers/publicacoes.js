var Publicacao = require('../models/publicacoes')

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


module.exports.filtrar_grupo = grupo => {
    return Publicacao
        .find({ grupo: grupo })
        .exec()
}

module.exports.filtrar_sem_grupo = () => {
    return Publicacao
        .find({ grupo: "" })
        .exec()
}

// Listar por utilizador

module.exports.filtrar_utilizador = utilizador => {
    return Publicacao
        .find({ utilizador: utilizador })
        .sort({ "data": - 1 })
        .exec()
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

module.exports.remover = pid => {
    return Publicacao
        .deleteOne({ _id: pid })
        .exec()
}

// Inserção de comentário

module.exports.adicionarComentario = (com, pubid) => {
    return Publicacao
        .findOneAndUpdate({ "_id": pubid }, { $push: { "comentarios": com } })
}

module.exports.removerComentario = (comid, pubid) => {
    return Publicacao
        .findOneAndUpdate({ "_id": pubid }, { $pull: { comentarios: { _id: comid } } })
}

