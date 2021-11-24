'use strict'

//IMPORTACIONES
const express = require("express");
const asignacionControlador = require("../controladores/asignacion.controlador")

//MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();
api.get('/ejemplo',md_autenticacion.ensureAuth ,asignacionControlador.ejemplo);
api.get('/obtenerAsignaciones',md_autenticacion.ensureAuth,asignacionControlador.obtenerAsignaciones);
api.put('/editarAsignacion/:idAsignacion',md_autenticacion.ensureAuth ,asignacionControlador.editarAsignacion)
api.delete('/eliminarAsignacion/:idAsignacion',md_autenticacion.ensureAuth ,asignacionControlador.eliminarAsignacion);
api.post('/registrarAsignacion',md_autenticacion.ensureAuth,asignacionControlador.registrarAsignacion);
module.exports = api;


