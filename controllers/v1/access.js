const { response, request } = require('express');
const error_log = require('../../helpers/error');
const AccessModel = require('../../models/access');

class Access{

    getAccess = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const rol = await AccessModel.findById( id )
            
            res.status( 200 ).json({
                status: 200,
                msg: rol,
                id: id
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador Access','Access.js getAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador Access' 
            } );
        }
    }
    
    getAllAccess = async ( req = request,res = response ) => {
        try {

            const query = { status: true };
            const { from = 0, limit = 10 } = req.query;

            const [ total, rol ] = await Promise.all([
                AccessModel.countDocuments( query ),
                AccessModel.find( query )
                    .skip( Number ( from ) )
                    .limit( Number( limit ) ) 
            ])
           
            res.status( 200 ).json({
                status: 200,
                msg: {total: total, Access: rol}
            });
            
        } catch (error) {
            error_log(error,'Error interno del controlador Access','Access.js getAllAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador Access' 
            } );
        }
        
    }

    postAccess = async ( req = request,res = response ) => {
        try {

            const { module } = req.body;
            const rol = new AccessModel( { module } );

            await rol.save();
            res.status( 200 ).json( { status: 201,msg: 'Created' } );

        } catch (error) {
            console.log(error);
            error_log(error,'Error interno del controlador Access','Access.js postAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador Access' 
            } );
            
        }
        
    }
    
    putAccess = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const { module } = req.body;

            const rol = await AccessModel.findByIdAndUpdate( id, module );

            res.status(200).json({
                status: 200,
                msg: rol
            });

        } catch (error) {
            error_log(error,'Error interno del controlador Access','Access.js putAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador Access' 
            } );
        }
    }
    
    deleteAccess = async ( req = request,res = response ) => {
        try {
            const { id } = req.params;
            const update = { status: false }
            const rol = await AccessModel.findByIdAndUpdate( id, update );
            rol.status = false;

            res.status(200).json({
                status: 200,
                msg: rol,
                modifire: req.user
            });

        } catch (error) {
            error_log(error,'Error interno del controlador Access','Access.js deleteAccess');
            res.status( 500 ).json( { 
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error interno del controlador Access' 
            } );
        }
    }

}

module.exports = Access;