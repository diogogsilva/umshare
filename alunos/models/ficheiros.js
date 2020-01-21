const mongoose = require('mongoose')

var ficheiroSchema = new mongoose.Schema({
    designacao: { type: String },
    size: { type: String },
    mimetype: { type: String },
    dataupload: { type: String },
    dataud: { type: String }
});

module.exports = mongoose.model('ficheiros', ficheiroSchema)
