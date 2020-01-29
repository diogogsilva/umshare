var Ficheiro = require('../models/ficheiros')
module.exports.listar = () => {
    return Ficheiro
        .find()
        .exec()
}

module.exports.inserir = f => {
    return Ficheiro
        .insert({ f })
        .exec()
}
