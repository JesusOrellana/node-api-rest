const { response, request } = require('express');
const error_log = require('../../helpers/error');
const RoleAccessModel = require('../../models/role_access');

class RoleAccess{

    getRoleAccess = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const rol = await RoleAccessModel.findById( id )
            .populate({path:'role',select: 'name' })
            .populate({path:'access',select: 'module' })
            
            res.status( 200 ).json({
                status: 200,
                msg: rol,
                id: id
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador RoleAccess','RoleAccesss.js getRoleAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador RoleAccess' 
            } );
        }
    }
    
    getAllRoleAccess = async ( req = request,res = response ) => {
        try {

            const query = { status: true };
            const { from = 0, limit = 10 } = req.query;

            const [ total, rol ] = await Promise.all([
                RoleAccessModel.countDocuments( query ),
                RoleAccessModel.find( query )
                .populate({path:'role',select: 'name' })
                .populate({path:'access',select: 'module' })
                .skip( Number ( from ) )
                .limit( Number( limit ) ) 
            ])
           
            res.status( 200 ).json({
                status: 200,
                msg: {total: total, RoleAccesss: rol}
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador RoleAccess','RoleAccesss.js getAllRoleAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador RoleAccess' 
            } );
        }
        
    }

    postRoleAccess = async ( req = request,res = response ) => {
        try {

            const { role, access, create, read, update, delet, manage  } = req.body;

            const rol = new RoleAccessModel( { role, access, create, read, update, delet, manage  });

            await rol.save();
            res.status( 200 ).json( { status: 201,msg: 'Created' } );

        } catch (error) {
            console.log(error);
            error_log(error,'Error interno del controlador RoleAccess','RoleAccesss.js postRoleAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador RoleAccess' 
            } );
            
        }
        
    }
    
    putRoleAccess = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const { status, ...update } = req.body;

            const rol = await RoleAccessModel.findByIdAndUpdate( id, update );

            res.status(200).json({
                status: 200,
                msg: rol
            });

        } catch (error) {
            error_log(error,'Error interno del controlador RoleAccess','RoleAccesss.js putRoleAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador RoleAccess' 
            } );
        }
    }
    
    deleteRoleAccess = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const update = { status: false }
            const rol = await RoleAccessModel.findByIdAndUpdate( id, update );
            rol.status = false;

            res.status(200).json({
                status: 200,
                msg: rol,
                modifire: req.user
            });

        } catch (error) {
            error_log(error,'Error interno del controlador RoleAccess','RoleAccesss.js deleteRoleAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador RoleAccess' 
            } );
        }
    }

}

module.exports = RoleAccess;