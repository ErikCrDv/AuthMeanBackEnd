const { response } = require("express");
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt');

const registerUsuario = async (req, res=response) => {
    const { name, email, password } = req.body;

    try {
        // Verificar Email Unico
        const usuario = await Usuario.findOne( { email } );
        if( usuario ){
            return res.status(400).json({ ok: false, msg: 'Ya existe un usuario con este email'});
        }
        console.log();
        //Crear usuaruo 
        const dbUsuario = new Usuario( req.body );
        
        // EncryptarPss - Hash
        const salt = bcrypt.genSaltSync();
        dbUsuario.password = bcrypt.hashSync( password, salt );

        // Jwt
        const token = await generarJwt( dbUsuario.id, name )
        
        // Crear usuario en Bd
        await dbUsuario.save();
        
        // Response
        return res.status(201).json({ ok: true, msg: 'Registro Exitoso', uid: dbUsuario.id, name, email, token });

        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Algo ha salido mal'
        });
    }

}

const loginUsuario = async (req, res=response) => {
    const { email, password } = req.body;

    try {

        // Verificar Email Exists 
        const dbUsuario = await Usuario.findOne( { email } );
        if( !dbUsuario ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no validas'
            });
        }

        // Password Match
        const validPassword = bcrypt.compareSync( password, dbUsuario.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales no validas'
            });
        }

        // Jwt
        const token = await generarJwt( dbUsuario.id, dbUsuario.name )

        // Response
        return res.status(200).json({ ok: true, msg: 'Login Exitoso', uid: dbUsuario.id, name: dbUsuario.name, email: dbUsuario.email, token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Algo ha salido mal'
        });
    }
}

const tokenUsuario = async (req, res) => {

    const { uid } = req;

    // Find Data User Db
    const dbUsuario = await Usuario.findById( uid );
    
    // Jwt
    const token = await generarJwt( uid, dbUsuario.name )

    return res.status(200).json({
        ok: true,
        uid,
        name: dbUsuario.name,
        email: dbUsuario.email,
        token
    });
}

module.exports = {
    registerUsuario,
    loginUsuario,
    tokenUsuario
}