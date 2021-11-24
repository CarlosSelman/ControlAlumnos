'use strict'

//IMPORTACIONES
const express = require("express");
const cursoControlador = require("../controladores/curso.controlador")

//MIDDLEWARES
var md_autenticacion = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();
api.get('/ejemplo',md_autenticacion.ensureAuth ,cursoControlador.ejemplo);
api.get('/obtenerCursos',md_autenticacion.ensureAuth,cursoControlador.obtenerCursos);
api.get('/obtenerCursoId/:idCurso',cursoControlador.obtenerCursoID);
//api.post('/login',usuarioControlador.login);
api.put('/editarCurso/:idCurso',md_autenticacion.ensureAuth ,cursoControlador.editarCurso)
api.delete('/eliminarCurso/:idCurso',md_autenticacion.ensureAuth ,cursoControlador.eliminarCurso);
api.post('/registrarCurso',md_autenticacion.ensureAuth,cursoControlador.registrarCurso);
module.exports = api;


