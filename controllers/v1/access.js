const bcryptjs = require('bcryptjs');
const db = require('../../database/config');
const AccessModel = db.access;
const Sequelize = db.sequelize;
const Op = db.sequelize.Op;


class Access {

    getAccess = async (req,res) => {

        try {

            const { id } = req.params;
            const Access = await AccessModel.findByPk(id);

            res.status(200).json({
                status: 200, 
                msg: Access
            });
            

        } catch (error) {
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la consulta a la tabla Access'
            });
        }
    
    }

    getAllAccess = async (req,res) => {

        try {

            const Access = await AccessModel.findAll();

            res.status(200).json({
                status: 200, 
                msg: Access
            });
            

        } catch (error) {
            console.log("🚀 ~ file: access.js ~ line 46 ~ Access ~ getAllAccess= ~ error", error)
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la consulta'
            });
        }
    
    }

    postAccess = async (req,res) => {

        try {

            let { module } = req.body;
            
            const data = {
                module: module
            }

            let Access = await AccessModel.create(data);

            res.status(201).json({
                status: 201, 
                msg: 'Created'
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al crear el access'
            });
        }
    
    }

    putAccess = async (req,res) => {

        try {

            const { id } = req.params;
            let {  status, createdAt, updateAt, ...update } = req.body;

            await AccessModel.update( update , {
                where: { id: id }
            });

            res.status(200).json({
                status: 200, 
                msg: 'access Actualizado',
            });

        } catch (error) {

            console.log(error);
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la actualización'
            });
        }
    
    }

    deleteAccess = async (req,res) => {

        try {

            let { action = '' } = req.query;
            const { id } = req.params;
            let update = action == 'enable'? { status: 1 } : { status: 0 };
            let msg = action == 'enable'? 'Activado' : 'Desactivado';

            await AccessModel.update( update , {
                where: { id: id }
            });

            res.status(200).json({
                status: 200, 
                msg: `access ${ msg }`,
            });

        } catch (error) {

            console.log(error);
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la acción'
            });
        }
    
    }

}

module.exports = Access;