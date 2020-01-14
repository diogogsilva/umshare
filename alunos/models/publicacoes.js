const mongoose = require('mongoose')

var publicacaoSchema = new mongoose.Schema({
    conteudo: { type: String },
    ficheiro: [String],
    tipo: { String },
    utilizador: { type: String },
    metadata: [String],
    grupo: { type: String },
    data: { type: String }
});

module.exports = mongoose.model('publicacoes', publicacaoSchema)