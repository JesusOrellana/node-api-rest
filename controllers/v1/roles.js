const { response, request } = require('express');
const error_log = require('../../helpers/error');
const RoleModel = require('../../models/roles');

class Role{

    getRole = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const rol = await RoleModel.findById( id )
            
            res.status( 200 ).json({
                status: 200,
                msg: rol,
                id: id
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador role','roles.js getRole');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador role' 
            } );
        }
    }
    
    getAllRole = async ( req = request,res = response ) => {
        try {

            const query = { status: true };
            const { from = 0, limit = 10 } = req.query;

            const [ total, rol ] = await Promise.all([
                RoleModel.countDocuments( query ),
                RoleModel.find( query )
                    .skip( Number ( from ) )
                    .limit( Number( limit ) ) 
            ])
           
            res.status( 200 ).json({
                status: 200,
                msg: {total: total, roles: rol}
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador role','roles.js getAllRole');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador role' 
            } );
        }
        
    }

    postRole = async ( req = request,res = response ) => {
        try {

            const { name } = req.body;
            const rol = new RoleModel( { name } );

            await rol.save();
            res.status( 200 ).json( { status: 201,msg: 'Created' } );

        } catch (error) {
            console.log(error);
            error_log(error,'Error interno del controlador role','roles.js postRole');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador role' 
            } );
            
        }
        
    }
    
    putRole = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const rol = await RoleModel.findByIdAndUpdate( id, name );

            res.status(200).json({
                status: 200,
                msg: rol
            });

        } catch (error) {
            error_log(error,'Error interno del controlador role','roles.js putRole');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador role' 
            } );
        }
    }
    
    deleteRole = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const update = { status: false }
            const rol = await RoleModel.findByIdAndUpdate( id, update );
            rol.status = false;

            res.status(200).json({
                status: 200,
                msg: rol,
                modifire: req.user
            });

        } catch (error) {
            error_log(error,'Error interno del controlador role','roles.js deleteRole');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador role' 
            } );
        }
    }

}

module.exports = Role;