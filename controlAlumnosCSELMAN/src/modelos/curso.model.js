const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CursoSchema = Schema({
    nombre: String,
    idUsuarioProfesor: {type: Schema.Types.ObjectId, ref : 'usuarios'}
})

module.exports = mongoose.model('cursos', CursoSchema)