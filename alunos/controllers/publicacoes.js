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

<<<<<<< HEAD
module.exports.filtrarPorGrupo = grupoid => {
=======
module.exports.filtrar_grupo = grupo => {
>>>>>>> f6b7c7136f091adc72ff47e8b6b65e0d30a5cf47
    return Publicacao
        .findOne({ grupo: grupo })
        .exec()
}

// Listar por utilizador

<<<<<<< HEAD
module.exports.filtrarPorUser = utilizadorid => {
    return Publicacao
        .find({ utilizador: utilizadorid })
=======
module.exports.filtrar_utilizador = utilizador => {
    return Publicacao
        .findOne({ utilizador: utilizador })
>>>>>>> f6b7c7136f091adc72ff47e8b6b65e0d30a5cf47
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

// Inserção de comentário

module.exports.adicionarComentario = (com, pubid) => {
    return Publicacao
        .findOneAndUpdate({ "_id": pubid }, { $push: { "comentarios": com } })
}

module.exports.removerComentario = (comid, pubid) => {
    return Publicacao
        .update({ "_id": pubid }, { $pull: { "comentarios": comid } })
}

