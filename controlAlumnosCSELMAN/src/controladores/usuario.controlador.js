'use strict'

//IMPORTACIONES
const Usuario = require('../modelos/usuario.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");
const usuarioModel = require('../modelos/usuario.model');

//FUNCION EJEMPLO
//app.get('ruta', function(req,res){})
// Otra forma
//exports.ejemplo = (req,res) =>{
//    res.status(200).send({mensaje: 'Holo, soy un ejemplo! :D' })
//}
function ejemplo(req,res) {
    res.status(200).send({mensaje: `Hola, mis datos son ${req.user.usuario + '-' + req.user.rol}`})
}

function crearUsuarioEstatico(req,res) {
   var  usuarioModel = new Usuario(); 
   usuarioModel.usuario = 'MAESTRO';
   usuarioModel.password = '123456';
   usuarioModel.rol = 'ROL_MAESTRO'

   Usuario.find({ $or: [
    {usuario: usuarioModel.usuario}
    ]}).exec((err, usuariosEncontrados)=>{
    if (err) return console.log('Error en la peticion del Usuario')  
    
    if (usuariosEncontrados 
        && usuariosEncontrados.length >=1) {
        return console.log('El usuario ya existe')
    }else{
        bcrypt.hash('123456',null,null,(err, passwordEncriptada)=>{
            usuarioModel.password = passwordEncriptada;
            usuarioModel.save((err,usuarioGuardado)=>{
                if (err) return console.log('Error al guardar el Usuario');
                    
                if (usuarioGuardado) {
                    return console.log(usuarioGuardado)    
                }else{
                    return console.log( 'No se ha podido registrar el Usuario')
                }
            })
        })

    }
})
}

function registrar(req,res) {
    var usuarioModel = new Usuario();
    var params = req.body;

    if (params.usuario && params.email && params.password) {
        usuarioModel.nombre = params.nombre;
        usuarioModel.usuario = params.usuario;
        usuarioModel.email = params.email;
        //usuarioModel.rol='ROL_MAESTRO';
        usuarioModel.imagen = null;
        
        Usuario.find({ $or: [
            {usuario: usuarioModel.usuario},
            {email: usuarioModel.email}
        ]}).exec((err, usuariosEncontrados)=>{
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion del Usuario' })  
            
            if (usuariosEncontrados 
                && usuariosEncontrados.length >=1) {
                return res.status(500).send({mensaje: 'El usuario ya existe'})
            }else{
                bcrypt.hash(params.password,null,null,(err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err,usuarioGuardado)=>{
                        if (err) return res.status(500).send({mensaje: 'Error al guardar el Usuario'});
                            
                        if (usuarioGuardado) {
                            res.status(200).send(usuarioGuardado)    
                        }else{
                            res.status(404).send({mensaje: 'No se ha podido registrar el Usuario'})
                        }
                    })
                })

            }
        })
    }    
}

function obtenerUsuarios(req, res) {
    //Usuario.find().exec((err,usuariosEncontrados)=>{})
    Usuario.find((err, usuariosEncontrados)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de obtener Usuarios'})
        if(!usuariosEncontrados) return res.status(500).send({mensaje: 'Error en la consulta de Usuarios'})
         //usuariosEncontrados === [datos] || !usuariosEncontrados === [] <-- no trae nada
        if(req.user.rol=='ROL_MAESTRO'){
           return res.status(200).send({usuariosEncontrados})
        }else{
            res.status(403).send({mensaje: 'No tiene los permisos'}) 
        }
        // {
        //  usuariosEncontrados: ["array de lo que contenga esta variable"]   
        // }
        
    })
}

function obtenerUsuarioID(req,res) {
    var idUsuario = req.params.idUsuario

    //User.find({_id: idUsuario}, (err,usuariosEncontrado)=>{}) <-----Me retorna un Array =[] || usuarioEncontrado[0].nombre
    // User.findOne({_id: idUsuario}, (err,usuariosEncontrado)=>{}) <-----Me retorna un Array =[] || usuarioEncontrado[0].nombre<----Me retorna un objeto = {} usuarioEncontrado.nombre
    Usuario.findById(idUsuario, (err,usuariosEncontrado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion del Usuario'})
        if(!usuariosEncontrado) return res.status(500).send({mensaje: 'Error en obtener los datos del Usuario'})
        console.log(usuariosEncontrado.email, usuariosEncontrado.usuario);
        return res.status(200).send({usuariosEncontrado})
    })
}

function login(req,res) {
    var params = req.body;

    Usuario.findOne({ usuario: params.usuario },(err,usuarioEncontrado)=>{ 
        
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});

        if (usuarioEncontrado) {  //TRUE O FALSE
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passCorrecta)=>{
                if(passCorrecta){
                    if (params.obtenerToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(usuarioEncontrado)
                        });
                    }else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({usuarioEncontrado})
                    }
                }else{
                    return res.status(404).send({ mensaje:'El usuario no se a podido identificar'})
                }
            })
        }else{
            return res.status(404).send({ mensaje:'El usuario no  a podido ingresar'})
        }
    })
}

function editarUsuario(req,res) {
    var idUsuario = req.params.idUsuario;
    var params = req.body;
    
    //BORRAR LA PROPIEDAD DE PASSWORD PARA QUE NO SE PUEDA EDITAR
    delete params.password;

    //req.user.sub <----- id usuario logeado
    if(idUsuario != req.user.sub){
        return res.status(500).send({mensaje: 'No posees los permisos nesesarios para actualizar este Usuario.'})
    }
    
    Usuario.findByIdAndUpdate(idUsuario, params, { new: true }, (err,usuarioActualizado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticions'});
        if(!usuarioActualizado) return res.status(500).send({mensaje: 'No se ha podido actualizar el Usuario'});
        return res.status(200).send({usuarioActualizado});   
     })
}

function eliminarUsuario(req,res) {
    const idUsuario = req.params.idUsuario;
    if(idUsuario != req.user.sub){
        return res.status(500).send({mensaje: 'No posee los permisos para eliminar a este Usuario.'});
    }
    Usuario.findByIdAndDelete(idUsuario,(err,usuarioEliminado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion de eliminar'});
        if(!usuarioEliminado) return res.status(500).send({mensaje: 'Error al eliminar el usuario.'});
        return res.status(200).send({usuarioEliminado});   
    })
}


module.exports = {
    ejemplo,
    registrar,
    obtenerUsuarios,
    obtenerUsuarioID,
    login,
    editarUsuario,
    eliminarUsuario,
    crearUsuarioEstatico
}

//------------------------------------------------------------------------------------------------------

//Funcion de ejemplo que no se va a utilizar solo es para explicacion
function ejemploCas(params) {
    /*
        Categoría Frutas pero cuando se elimine, todos los productos pasaran a categoria default
    */
   Productos.find((err,productos)=>{
       Products.updateMany((err,editarADefault)=>{
        Categoría.findByIdAndDelete((err, eliminarFrutas)=>{
            return res.status(200).send({aviso: 'Funciono Correctamente'});
        })
       })
   })
}

