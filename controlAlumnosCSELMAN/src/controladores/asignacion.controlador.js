'use strict'

//IMPORTACIONES
const Curso = require('../modelos/asignacion.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");
const cursoModel = require('../modelos/asignacion.model');

function ejemplo(req,res) {
    res.status(200).send({mensaje: `Hola, mis datos son ${req.user.usuario + '-' + req.user.rol}`})
}

function registrarAsignacion(req,res) {
    var asignacionModel = new Asignacion();
    var params = req.body;

    if (params.idEstudiante && params.idUsuarioProfesor) {
        asignacionModel.idEstudiante = params.idEstudiante;
        asignacionModel.idUsuarioProfesor = req.user.sub;
        //usuarioModel.rol='ROL_MAESTRO';
        asignacionModel.imagen = null;

        Asignacion.find({ $or: [
            {idEstudiante: asignacionModel.idEstudiante},
        ]}).exec((err, asignacionesEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del curso' })  
            
            if (asignacionesEncontrados 
                && asignacionesEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'La asignacion ya existe'})
            }else{
                    asignacionModel.save((err,asignacionGuardado)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el Curso'});
                            
                        if (req.user.rol=='ROL_MAESTRO' && asignacionGuardado) {
                            res.status(200).send(asignacionGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar la asignacion'})
                        }
                    })
            }
        })
    }    
}
//VALIDAR PARA QUE SOLO MUESTRE LOS DEL MISMO ID LOGUEADO
function obtenerAsignaciones(req, res) {
    Asignacion.find((err, asignacionesEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener asignaciones'})
        if(!asignacionesEncontrados) return res.status(500).send({mensaje: 'Error en la consulta de asignaciones'})
        if(req.user.rol=='ROL_MAESTRO'){
            return res.status(200).send({asignacionesEncontrados})
         }else{
             res.status(403).send({mensaje: 'No tiene los permisos o no se ha realizado alguna asignacion'}) 
         }
    })
}

function editarAsignacion(req,res) {
    var idAsignacion= req.params.idAsignacion;
    var idUsuario = req.params.idUsuarioProfesor;
    var params = req.body;
    
    //BORRAR LA PROPIEDAD DE PASSWORD PARA QUE NO SE PUEDA EDITAR
    //delete params.password;

    //req.user.sub <----- id usuario logeado
    if(idUsuario != req.user.sub){
        return res.status(500).send({mensaje: 'No posees los permisos nesesarios para actualizar esta Asignacion.'})
    }
    
    Asignacion.findByIdAndUpdate(idAsignacion, params, { new: true }, (err,asignacionActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!asignacionActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar esta Asignacion'});
        return res.status(200).send({asignacionActualizado});   
     })
     
}

function eliminarAsignacion(req,res) {
    const idAsignacion = req.params.idAsignacion;
    if(idUsuarioProfesor != req.user.sub){
        return res.status(500).send({mensaje: 'No posee los permisos para eliminar a este Curso.'});
    }
    Asignacion.findByIdAndDelete(idAsignacion,(err,asignacionEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar'});
        if(!asignacionEliminado) return res.status(500).send({mensaje: 'Error al eliminar la asignacion.'});
        return res.status(200).send({asignacionEliminado});   
    })
}

module.exports = {
    ejemplo,
    obtenerAsignaciones,
    editarAsignacion,
    eliminarAsignacion,
    registrarAsignacion
}



