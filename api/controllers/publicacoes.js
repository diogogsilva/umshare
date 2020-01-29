var Publicacao = require('../models/publicacoes')

// listar todos

module.exports.listar = () => {
    return Publicacao
        .find()
        .sort({data: -1})
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
        .sort({data: -1})
        .exec()
}

module.exports.filtrar_sem_grupo = () => {
    return Publicacao
        .find({ grupo: "" })
        .sort({ "data": - 1 })
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

module.exports.filtrar_pubs_metadata = (md) => {
    return Publicacao
        .aggregate(
            [{ $unwind: "$metadata" }, { $match: { 'metadata': md, grupo: '' } }, { $sort: { data: -1 } }]
        )
}

module.exports.listar_tags = (grupo) => {
    return Publicacao
        .aggregate(
            [{ $unwind: "$metadata" }, { $match: { "grupo": grupo } }, { $group: { _id: "$metadata", count: { $sum: 1 } } }, { $sort: { count: -1, _id: 1 } }]
        )
}

//db.publicacoes.aggregate([{$unwind: "$metadata"}, {$match: {"utilizador" : "ruijorge@gmail.com", "grupo" : ""}}, {$group:{_id: "$metadata", count:{$sum:1}}}, {$sort:{count:-1}}])

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

