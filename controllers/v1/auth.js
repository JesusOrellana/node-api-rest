const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { generarJWT, googleVerify, generatePassword } = require('../../helpers/auth');
const jwt = require("jsonwebtoken");
const db = require('../../database/config');
const UserModel = db.users;
const Sequelize = db.sequelize;
const Op = db.sequelize.Op;
  

class Auth{
    

    login = async (  req, res ) => {

        try {

            let { email, password } = req.body;

            let user = await UserModel.findOne({ 
                where: { email: email } 
            });

            if (user === null) {

                res.status(404).json({
                    status: 404, 
                    msg: 'Not Found',
                    description: 'No existe ningun usuario relacionado con este correo'
                });

            } else {
                
                if ( !user.status ) {
                    return res.status( 400 ).json({
                        status: 400,
                        msg: 'Bad Request',
                        description: 'Usuario o Contraseña no son correctos'
                    });
                }

                const validPassword = bcryptjs.compareSync( password, user.password )

                if ( !validPassword ) {
                    return res.status( 400 ).json({
                        status: 400,
                        msg: 'Bad Request',
                        description: 'Usuario o Contraseña no son correctos'
                    });
                }

                const token = await generarJWT( user.id );

                res.status( 200 ).json({
                    status: 200,
                    msg: {
                        "name": `${user.name} ${user.lastName}`,
                        "email": user.email,
                        token }
                });
            }

        } catch (error) {
            
            console.log(error);

        }
    }

    googleSignIn = async ( req = request,res = response ) => {

        const { id_token } = req.body;
        try {

            const { email, name, lastName } = await googleVerify( id_token );
            
            let user = await UserModel.findOne({ 
                where: { email: email } 
            });
            
            if( user === null ) {

                const password = generatePassword();
                const data = {
                    email: email, password: password , name: name, lastName: lastName, google: 1, role: 2
                }

                let user = await UserModel.create(data);

                const token = await generarJWT( user.id );
            
                res.status( 201 ).json({
                    status: 201,
                    msg: { name: name, lastName: lastName, email: email, token }
                });

            } else {

                if( !user.status ) {
                    console.log(user.status)
                    return res.status( 401 ).json({ status: 401,  msg: "Unauthorized", description: 'Sin autorización' });
    
                }
    
                const token = await generarJWT( user.id );
                
                res.status( 200 ).json({
                    status: 200,
                    msg: { name: name, lastName: lastName, email: email, token}
                });

            }

            
            

        } catch (error) {
            console.log(error);
            res.status( 400 ).json({ status: 500, msg: "Internal Server Error", description:'No se pudo verificar el token' })
        }

    }

/*     verifyToken  = async (  req = request,res = response) => {

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
    } */

}

module.exports = Auth;