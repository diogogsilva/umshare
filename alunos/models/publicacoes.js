const mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
    conteudo: { type: String },
    utilizador: { type: String },
    data: { type: String }
});

var ficheiroSchema = new mongoose.Schema({
    designacao: { type: String },
    size: { type: String },
    mimetype: { type: String },
    dataupload: { type: String },
    dataud: { type: String }
});

var publicacaoSchema = new mongoose.Schema({
    conteudo: { type: String },
    ficheiros: [ficheiroSchema],
    tipo: { String },
    utilizador: { type: String },
    metadata: [String],
    grupo: { type: String },
    comentarios: [comentarioSchema],
    data: { type: String }
});

module.exports = mongoose.model('publicacoes', publicacaoSchema)