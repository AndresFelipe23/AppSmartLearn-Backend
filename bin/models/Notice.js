const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NoticiasSchema = new mongoose.Schema({
  title: String,
  autor: String,
  idAutor: {
    type: Schema.Types.ObjectId,
    ref: "people"
  },
  category: String,
  time: String,
  fechaCaducidad: Date,
  observacion: String, // Para noticias rechazadas por docentes
  abstract: String,
  content: String,
  images: String,
  comentario: String,
  estado: {
    type: Schema.Types.ObjectId,
    ref: "Estado",
    autopopulate: true,
    default: new mongoose.Types.ObjectId("6502fbb06f68e90bf2ac9220")
  },
  aprobada: {
    type: Boolean,
    default: false // Valor predeterminado
  }
});

var Notice = mongoose.model("Notice", NoticiasSchema);
module.exports = Notice;
