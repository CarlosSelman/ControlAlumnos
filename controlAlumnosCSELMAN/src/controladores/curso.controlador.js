'use strict'

//IMPORTACIONES
const Curso = require('../modelos/curso.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");
const cursoModel = require('../modelos/curso.model');

function ejemplo(req,res) {
    res.status(200).send({mensaje: `Hola, mis datos son ${req.user.usuario + '-' + req.user.rol}`})
}

function registrarCurso(req,res) {
    var cursoModel = new Curso();
    var params = req.body;

    if (params.nombre && params.idUsuarioProfesor) {
        cursoModel.nombre = params.nombre;
        cursoModel.idUsuarioProfesor = req.user.sub;
        //usuarioModel.rol='ROL_MAESTRO';
        cursoModel.imagen = null;

        Curso.find({ $or: [
            {nombre: cursoModel.nombre},
        ]}).exec((err, cursosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del curso' })  
            
            if (cursosEncontrados 
                && cursosEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'El curso ya existe'})
            }else{
                    cursoModel.save((err,cursoGuardado)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el Curso'});
                            
                        if (req.user.rol=='ROL_MAESTRO' && cursoGuardado) {
                            res.status(200).send(cursoGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el Curso'})
                        }
                    })
            }
        })
    }    
}
//VALIDAR PARA QUE SOLO MUESTRE LOS DEL MISMO ID LOGUEADO
function obtenerCursos(req, res) {
    Curso.find((err, cursosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener cursos'})
        if(!cursosEncontrados) return res.status(500).send({mensaje: 'Error en la consulta de Cursos'})
        if(req.user.rol=='ROL_MAESTRO'){
            return res.status(200).send({cursosEncontrados})
         }else{
             res.status(403).send({mensaje: 'No tiene los permisos o no se le a asignado ningun curso'}) 
         }
    })
}

function obtenerCursoID(req,res) {

    Usuario.findById(idCurso, (err,cursosEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion del curso'})
        if(!cursosEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos del curso'})
        console.log(cursosEncontrado.nombre, cursosEncontrado.idUsuarioProfesor);
        return res.status(200).send({cursosEncontrado})
    })
}

function editarCurso(req,res) {
    var idCurso = req.params.idCurso;
    var idUsuario = req.params.idUsuarioProfesor;
    var params = req.body;
    
    //BORRAR LA PROPIEDAD DE PASSWORD PARA QUE NO SE PUEDA EDITAR
    //delete params.password;

    //req.user.sub <----- id usuario logeado
    if(idUsuario != req.user.sub){
        return res.status(500).send({mensaje: 'No posees los permisos nesesarios para actualizar este CURSO.'})
    }
    
    Curso.findByIdAndUpdate(idCurso, params, { new: true }, (err,cursoActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!cursoActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar el curso'});
        return res.status(200).send({cursoActualizado});   
     })
}

function eliminarCurso(req,res) {
    const idCurso = req.params.idCurso;
    if(idUsuarioProfesor != req.user.sub){
        return res.status(500).send({mensaje: 'No posee los permisos para eliminar a este Curso.'});
    }
    Curso.findByIdAndDelete(idCurso,(err,cursoEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar'});
        if(!cursoEliminado) return res.status(500).send({mensaje: 'Error al eliminar el curso.'});
        return res.status(200).send({cursoEliminado});   
    })
}

module.exports = {
    ejemplo,
    obtenerCursos,
    obtenerCursoID,
    editarCurso,
    eliminarCurso,
    registrarCurso
}



