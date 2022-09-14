const bcryptjs = require('bcryptjs');
const db = require('../../database/config');
const RoleModel = db.roles;
const Sequelize = db.sequelize;
const Op = db.sequelize.Op;


class Role {

    getRole = async (req,res) => {

        try {

            const { id } = req.params;
            const roles = await RoleModel.findByPk(id);

            res.status(200).json({
                status: 200, 
                msg: roles
            });
            

        } catch (error) {
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la consulta a la tabla roles'
            });
        }
    
    }

    getAllRole = async (req,res) => {

        try {

            const roles = await RoleModel.findAll();

            res.status(200).json({
                status: 200, 
                msg: roles
            });
            

        } catch (error) {
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la consulta'
            });
        }
    
    }

    postRole = async (req,res) => {

        try {

            let { name } = req.body;
            
            const data = {
                name: name
            }

            let role = await RoleModel.create(data);

            res.status(201).json({
                status: 201, 
                msg: 'Created'
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al crear el rol'
            });
        }
    
    }

    putRole = async (req,res) => {

        try {

            const { id } = req.params;
            let {  status, createdAt, updateAt, ...update } = req.body;

            await RoleModel.update( update , {
                where: { id: id }
            });

            res.status(200).json({
                status: 200, 
                msg: 'rol Actualizado',
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

    deleteRole = async (req,res) => {

        try {

            let { action = '' } = req.query;
            const { id } = req.params;
            let update = action == 'enable'? { status: 1 } : { status: 0 };
            let msg = action == 'enable'? 'Activado' : 'Desactivado';

            await RoleModel.update( update , {
                where: { id: id }
            });

            res.status(200).json({
                status: 200, 
                msg: `rol ${ msg }`,
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

module.exports = Role;