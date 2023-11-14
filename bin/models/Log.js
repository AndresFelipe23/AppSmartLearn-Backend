
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LogSchema = new Schema({
    receptor: String,
    fecha: Date,
    statusHttp: String,
    detalles: String,
});

var Log = mongoose.model("Log", LogSchema);

module.exports = Log;
