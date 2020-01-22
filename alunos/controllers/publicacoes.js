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

module.exports.filtrar_grupo = grupo => {
    return Publicacao
        .findOne({ grupo: grupo })
        .exec()
}

// Listar por utilizador

module.exports.filtrar_utilizador = utilizador => {
    return Publicacao
        .findOne({ utilizador: utilizador })
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

module.exports.inserirComentario = (com, pubid) => {
    //var novoCom = new Comentario(com)
    Publicacao.findOneAndUpdate({ _id: pubid }, { $push: { comentarios: com } },
        function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        })
}