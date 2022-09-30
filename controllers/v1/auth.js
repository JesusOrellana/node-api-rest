const { response, request } = require('express');
const UserModel = require('../../models/users');
const bcryptjs = require('bcryptjs');
const { generarJWT, googleVerify, generatePassword } = require('../../helpers/auth');
const jwt = require("jsonwebtoken");



class Auth{

    login = async ( req = request,res = response ) => {
        try {

            const { email, password } = req.body;
            const user = await UserModel.findOne( { email } )
            .populate({path:'role', select: 'name'});

            if ( !user ) {
                return res.status( 400 ).json({
                    status: 400,
                    msg: 'User or Password are not correct'
                });
            }

            if ( !user.status ) {
                return res.status( 400 ).json({
                    status: 400,
                    msg: 'User or Password are not correct'
                });
            }

            const validPassword = bcryptjs.compareSync( password, user.password )

            if ( !validPassword ) {
                return res.status( 400 ).json({
                    status: 400,
                    msg: 'User or Password are not correct'
                });
            }

            const token = await generarJWT( user._id );

            res.status( 200 ).json({
                status: 200,
                msg: {user,token}
            });
            
        } catch (error) {
            res.status( 500 ).json({
                status: 500,
                msg: 'Error interno del controlador auth'
            });
        }
    }

    googleSignIn = async ( req = request,res = response ) => {

        const { id_token } = req.body;
        try {

            const { email, name, lastName, profilePicture } = await googleVerify( id_token );
            
            let user = await UserModel.findOne({ email: email },'email dni name lastName phone status emailCheck address gender');
            console.log(user);
            if( !user ) {

                const password = generatePassword();
                const data = {
                    email, password: password , name, lastName, profilePicture, google: true
                }

                user = new UserModel( data );
                await user.save();
            }

            if( !user.status ) {
                console.log(user.status)
                return res.status( 401 ).json({ status: 401, msg: 'Sin autorización' });

            }

            const token = await generarJWT( user._id );
            // difertenciar status cuando se crea un usuario ( 201 ) a cuando se inicia sesion ( 200 )
            res.status( 200 ).json({
                status: 200,
                msg: {user,token}
            });
            
            console.log(user);

        } catch (error) {
            console.log(error);
            res.status( 400 ).json({ status: 400,msg: 'No se pudo verificar el token' })
        }

    }

    verifyToken  = async (  req = request,res = response) => {

        const token = req.header('id_token');
    
        if ( !token ) {
            return res.status(401).json({ status: 401, msg: 'Sin autorización sin token'});
        }
        
        try {
    
            const { uid } = jwt.verify( token, process.env.PRIVATE_SIGNATURE );
            const user = await UserModel.findById( uid ).select('name  lastName role status')
            .populate({path:'role', select: 'role permits'});
            

            if ( !user ) {
                return res.status(401).json({ status: 401, msg: 'Sin autorización - user no existe'});
            }

            if (!user.role.permits.platform_access[0] || !user.status) {
                return res.status(401).json({ status: 401, msg: 'Sin autorización - no es admin o estado'});
            }

            return res.status(200).json({ status: 200, msg: 'Token valido'});
    
        } catch (error) {
            console.log(token);
            console.log(error);
            return res.status(401).json({ status: 401,msg: 'Token no válido' });
    
        }
    }

    createAccount = async ( req = request,res = response ) => {
        try {

            const { email, password } = req.body;
            const user = new UserModel( { email, password } );

            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync( password, salt );

            await user.save();
            const token = await generarJWT( user.uid );

            res.status( 201 ).json( { status: 200, msg: { user, token } } );
            
        } catch (error) {
            console.log(error)
            res.status( 500 ).json({
                status: 500,
                msg: 'Error interno del controlador auth'
            });
        }
    }
}

module.exports = Auth;