const mongoose = require('mongoose')

var comentarioSchema = new mongoose.Schema({
    conteudo: { type: String },
    utilizador: { type: String },
    data: { type: String }
});



module.exports = mongoose.model('comentarios', comentarioSchema)