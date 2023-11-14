const moongose = require("mongoose");
const { ObjectId } = require("mongodb");

const Schema = moongose.Schema;

const PeopleSchema = new Schema({
  name: String,
  last_name: String,
  identification: String,
  gender: String,
  rol: ObjectId, // String
  gender: String,
  username: String,
  password: String,
  isEditor: {
    type: Boolean,
    default: false // valor por defecto, se asume que no es redactor
  },
  isRedactor: {
    type: Boolean,
    default: false // valor por defecto, se asume que no es redactor
  },
  asignatures: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Area",
        autopopulate: true
      },

      Actividades: [
        {
          _id_actividad: {
            type: Schema.Types.ObjectId,
            ref: "Exercise",
            autopopulate: true
          },
          _id_state: String,
          dia: {
            dias: String,
            color: String,
            avan: String
          }
        }
      ],
      curso: Array
    }
  ],
  courestu: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    autopopulate: true
  },
  course: Object,
  title: String,
  menu: Array,
  nameAcudiente: String,
  apellidoAcudiente: String,
  CelularAcudiente: String,
  Direccion: String,
  emailAcudiente: String
});
PeopleSchema.plugin(require("mongoose-autopopulate"));
const People = moongose.model("People", PeopleSchema);

module.exports = People;
