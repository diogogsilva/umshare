const mongoose = require('mongoose')

var grupoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true},
    admin: { type: String, required: true},
    membros: { type: [String], required: false}
});

module.exports = mongoose.model('grupos', grupoSchema)