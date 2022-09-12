const bcryptjs = require('bcryptjs');
const db = require('../../database/config');
const UserModel = db.users;
const Sequelize = db.sequelize;
const Op = db.sequelize.Op;


class User {

    getUser = async (req,res) => {

        try {

            const { id } = req.params;
            const users = await Sequelize.query(
            `SELECT u.id, u.dni, CONCAT_WS(' ',u.name, u.lastName) as 'name ', u.email, 
            r.name as 'role', DATE_FORMAT(u.dateBirth,'%d-%m-%Y') as 'dateBirth',
            DATE_FORMAT(u.createdAt,'%d-%m-%Y') as 'createdAt', u.address, u.gender,
            u.country, u.city
            FROM users u JOIN roles r 
            ON ( u.role = r.id ) where u.id = ${id}`);

            res.status(200).json({
                status: 200, 
                msg: users[0][0]
            });
            

        } catch (error) {
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la consulta a la tabla users'
            });
        }
    
    }

    getAllUser = async (req,res) => {

        try {

            const { role = false } = req.query;
            let where = '';

            where = role === false ? 'where r.id != 2': `where r.id = ${role}`;

            const users = await Sequelize.query(
            `SELECT u.id, u.dni, CONCAT_WS(' ',u.name, u.lastName) as 'name ', u.email, 
            r.name as 'role', DATE_FORMAT(u.dateBirth,'%d-%m-%Y') as 'dateBirth',
            DATE_FORMAT(u.createdAt,'%d-%m-%Y') as 'createdAt', u.address, u.gender,
            u.country, u.city
            FROM users u JOIN roles r 
            ON ( u.role = r.id ) ${where}`);

            res.status(200).json({
                status: 200, 
                msg: users[0]
            });
            

        } catch (error) {
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al realizar la consulta'
            });
        }
    
    }

    postUser = async (req,res) => {

        try {

            let { dni, name, lastName, email, phone, dateBirth, role,
            password, address, gender, country, city } = req.body;
            
            const salt = bcryptjs.genSaltSync();
            password = bcryptjs.hashSync( password, salt );
            
            const data = {

                dni: dni,
                name: name,
                lastName: lastName,
                email: email,
                phone: phone,
                dateBirth: dateBirth,
                role: role,
                password: password,
                address: address,
                gender: gender, 
                country: country,
                city: city
            }

            let user = await UserModel.create(data);

            console.log("user auto-generated ID:", user.id);

            res.status(201).json({
                status: 201, 
                msg: 'Created'
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                status: 500, 
                msg: 'Internal Server Error',
                description: 'Error al crear el usuario'
            });
        }
    
    }

    putUser = async (req,res) => {

        try {

            const { id } = req.params;
            let { dni, status, createdAt, updateAt, ...update } = req.body;

            if ( update.password ) {

                const salt = bcryptjs.genSaltSync();
                update.password = bcryptjs.hashSync( update.password, salt );
            }

            await UserModel.update( update , {
                where: { id: id }
            });

            res.status(200).json({
                status: 200, 
                msg: 'Usuario Actualizado',
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

    deleteUser = async (req,res) => {

        try {

            let { action = '' } = req.query;
            const { id } = req.params;
            let update = action == 'enable'? { status: 1 } : { status: 0 };
            let msg = action == 'enable'? 'Activado' : 'Desactivado';

            await UserModel.update( update , {
                where: { id: id }
            });

            res.status(200).json({
                status: 200, 
                msg: `Usuario ${ msg }`,
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

module.exports = User;