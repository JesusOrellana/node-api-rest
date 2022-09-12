const { request, response} = require("express");
const jwt = require("jsonwebtoken");
const db = require('../database/config');
const UserModel = db.users;
const Sequelize = db.sequelize;
const Op = db.sequelize.Op;


const validateAccessByJWT = async (  req = request, res, next ) => {

    const token = req.header('CP_TOKEN');
    const path = req.baseUrl;
    const method = req.method;

    try {

        if ( !token ) {
            return res.status(401).json({ status: 401,  msg: "Unauthorized", description: 'Sin autorización' });
        }

        const { id } = jwt.verify( token, process.env.PRIVATE_SIGNATURE );
        const user = await Sequelize.query(
            `SELECT u.id, u.dni, CONCAT_WS(' ',u.name, u.lastName) as 'name ', u.email, 
            r.name as 'role', r.id as 'id_role', DATE_FORMAT(u.dateBirth,'%d-%m-%Y') as 'dateBirth',
            DATE_FORMAT(u.createdAt,'%d-%m-%Y') as 'createdAt', u.address, u.gender,
            u.country, u.city
            FROM users u JOIN roles r 
            ON ( u.role = r.id ) where u.id = ${id}`);

        if ( user === null ) {

            return res.status(401).json({ status: 401, msg: "Unauthorized", description: 'El usuario no existe' });

        }
        if ( user[0][0].id_role != 1 ) {

            if (user[0][0].status == 0 ) {

                return res.status(401).json({ status: 401, msg: "Unauthorized", description: 'Sin autorización status' });
            
            }
            else {

                const access = await Sequelize.query(
                `SELECT a.module, ra.create, ra.read, ra.update, ra.delete, ra.manage
                FROM roles r 
                JOIN role_access ra ON( ra.role = r.id )
                JOIN access a ON( a.id = ra.access )
                where r.id = ${user[0][0].id_role} AND a.module = '${path}'`);

                let flag = false;
                console.log(method);
                switch (method) {
                    case 'GET':
                        flag = access[0][0].read ? true : false;
                        console.log(access[0][0].read);
                        break;
                    case 'POST':
                        flag = access[0][0].create ? true : false;
                        break;
                    case 'PUT':
                        flag = access[0][0].update ? true : false;
                        break;
                    case 'DELETE':
                        flag = access[0][0].delete ? true : false;
                        break;
                    default:
                        flag = false
                    break;
                }

                if( flag ) {
                    req.user = user[0][0]
                    next() 
                }
                else {
                    return res.status(401).json({ status: 401,  msg: "Unauthorized", description: 'Sin autorización' });
                }

            }
            
            
        }
        else {
            req.user = user[0][0];
            next();
        }

        

    } catch (error) {
        console.log(error);
        return res.status(401).json({ status: 401, msg: 'Unauthorized', description: 'El Token no es valido' });

    }
}

module.exports = { validateAccessByJWT };