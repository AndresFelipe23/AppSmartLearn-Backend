const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EstadoSchema = new Schema({
    description: String
});

var Estado = mongoose.model("Estado", EstadoSchema);

module.exports = Estado;