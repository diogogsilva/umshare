const mongoose = require('mongoose')


var mensagemSchema = new mongoose.Schema({
    texto: { type: String },
    utilizadorRemetente: { type: String },
    data: { type: String },
});

var conversaSchema = new mongoose.Schema({
    mensagens: { type: [mensagemSchema]},
    membros : { type: [String]}
})

module.exports = mongoose.model('conversas', conversaSchema)