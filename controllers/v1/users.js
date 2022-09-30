const { response, request } = require('express');
const UserModel = require('../../models/users');
const RoleModel = require('../../models/roles');
const bcryptjs = require('bcryptjs');
const error_log = require('../../helpers/error');

class User{

    getUser = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const user = await UserModel.findById( id )
            .populate({path: 'role', select: 'role'})
            res.status( 200 ).json({
                status: 200,
                msg: user
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador user','users.js getUser');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador user' 
            } );
        }
    }
    
    getAllUser = async ( req = request,res = response ) => {
        try {

            let { from = 0, limit = 1000, name = '' } = req.query;
            let where = {};
            let role = '';

            if ( name == '' ) { 
                role = await RoleModel.findOne({name: 'USER_ROLE'});
                where = { role: { $ne: role._id }  } 
                console.log(where);
            }
            else { 

                role = await RoleModel.findOne({name: name}); 
                where = { role: role._id } 
                console.log(where);
            }

            const [ total, users ] = await Promise.all([
                UserModel.countDocuments(where),
                UserModel.find(where)
                .populate({path: 'role', select: 'name'})
                    .skip( Number ( from ) )
                    .limit( Number( limit ) ) 
            ])
           
            res.status( 200 ).json({
                status: 200,
                msg: {total: total, users: users}
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador user','users.js getAllUser');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador user' 
            } );
        }
        
    }

    postUser = async ( req = request,res = response ) => {
        try {

            const { password, status, google, emailCheck, ...insert } = req.body;
            const user = new UserModel( insert , password );

            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync( password, salt );

            await user.save();
            res.status( 201 ).json( { status: 201,msg: 'Created' } );

        } catch (error) {
            error_log(error,'Error interno del controlador user','users.js postUser');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador user' 
            } );
            
        }
        
    }
    
    putUser = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const { _id, password, google, emailCheck, identityCheck, ...update } = req.body;
            
            if( password ){
                const salt = bcryptjs.genSaltSync();
                update.password = bcryptjs.hashSync( password, salt );
            }

            const user = await UserModel.findByIdAndUpdate( id, update );

            res.status(200).json({
                status: 200,
                msg: user
            });

        } catch (error) {
            error_log(error,'Error interno del controlador user','users.js putUsers');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador user' 
            } );
        }
    }
    
    deleteUser = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const update = { status: false }
            const user = await UserModel.findByIdAndUpdate( id, update );
            user.status = false;
            res.status(200).json({
                status: 200,
                msg: 'Ok'
            });
        } catch (error) {
            error_log(error,'Error interno del controlador user','users.js deleteUser');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador user' 
            } );
        }
    }
}

module.exports = User;