'use strict'

//IMPORTACIONES
const express = require("express");
const encuestaControlador = require("../controladores/encuesta.controlador");
 
//MIDDLEWARES
const md_autenticacion = require("../middlewares/authenticated")
//RUTAS
const api = express.Router();

api.post('/agregarEncuesta',md_autenticacion.ensureAuth ,encuestaControlador.agregarEncuesta);
api.get('/obtenerEncuestas',md_autenticacion.ensureAuth ,encuestaControlador.obtenerEncuestas);
module.exports = api;