const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var AsignacionSchema = Schema({
    nombre: String,
    idEstudiante : {type: Schema.Types.ObjectId, ref : 'usuarios'},
    idUsuarioProfesor: {type: Schema.Types.ObjectId, ref : 'usuarios'}
})

module.exports = mongoose.model('asignaciones', AsignacionSchema)