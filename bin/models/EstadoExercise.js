const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EstadoExerciseSchema = new Schema({
    description: String
});

var EstadoExercise= mongoose.model("EstadoExercise", EstadoExerciseSchema);

module.exports = EstadoExercise;