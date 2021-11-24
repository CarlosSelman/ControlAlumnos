'use strict'

//VARIABLES GLOBALES
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")

//IMPORTACION RUTAS
const usuario_controlador = require("./src/controladores/usuario.controlador");
const usuario_ruta = require("./src/rutas/usuario.rutas");
const curso_controlador = require("./src/controladores/curso.controlador");
const curso_ruta = require("./src/rutas/cursos.rutas");
const encuesta_ruta = require("./src/rutas/encuesta.rutas");
const asignacion_controlador = require("./src/controladores/asignacion.controlador");
const asignacion_ruta = require("./src/rutas/asignacion.rutas");

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//CABECERAS
app.use(cors());

//CARGA DE RUTAS localhost:3000/api/obtenerUsuarios
app.use('/api', usuario_ruta,encuesta_ruta,curso_ruta,asignacion_ruta);


usuario_controlador.crearUsuarioEstatico();
//EXPORTAR
module.exports = app;