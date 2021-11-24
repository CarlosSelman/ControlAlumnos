'use strict'

var Encuesta = require('../modelos/encuesta.model');

function agregarEncuesta(req,res) {
    var params= req.body;
    var encuestaModel = new Encuesta();

    if(params.titulo && params.descripcion){
        encuestaModel.titulo=params.titulo;
        encuestaModel.descripcion=params.descripcion;
        encuestaModel.opinion={
            si: 0,
            no:0,
            ninguna: 0,
            usuariosEncuestados: []
        };
        encuestaModel.creadorEncuesta=req.user.sub;

        encuestaModel.save((err, encuestaGuardada)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion de la Encuesta'});
            if(!encuestaGuardada) return res.status(500).send({mensaje: 'Error al Agregar Encuesta'});

            return res.status(200).send({encuestaGuardada});
        });
    }else{
      res.status(500).send({
        mensaje: 'Rellene los datos necesarios para crear la Encuesta'
      });
    }
}

function obtenerEncuestas(req,res) {
    //Para que no traiga una linea ver la siguiente 
        //Encuesta.find({},{listaComentarios: 0}).populate('creadorEncuesta', 'nombre email').exec((err, encuestasEncontradas)=>{
    //Verificar si existe algo como esto alguno que tenga un numero 2
        //Encuesta.find({titulo:{$regex:'2',$option:'i'}},{listaComentarios: 0}).populate('creadorEncuesta', 'nombre email').exec((err, encuestasEncontradas)=>{

        Encuesta.find().populate('creadorEncuesta', 'nombre email').exec((err, encuestasEncontradas)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de encuestas'});
        if(!encuestasEncontradas) return res.status(500).send({mensaje: 'Error al obtener encuestas'});
        return res.status(200).send({encuestasEncontradas});
    })
}

module.exports = {
    agregarEncuesta,
    obtenerEncuestas
}