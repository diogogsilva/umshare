var Conversa = require('../models/conversas')

module.exports.listar = (id) => {
    return Conversa
        .aggregate(
           [
           {$match: {'membros': id}}] 
        )
}

module.exports.inserir = conversa => {
    var novo = new Conversa(conversa)
    return novo.save()
}

module.exports.listarConversasPorID = id => {
    return Conversa
        .findById(id)
        .exec()
}

module.exports.criarMensagensParaConversa = (id, mensagem, utilizador,data) => {
    return Conversa
        .update({ "_id": id }, { $push: { "mensagens": {texto:mensagem,utilizadorRemetente:utilizador,data:data}}})
}
