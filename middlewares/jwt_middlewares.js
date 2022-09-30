const { request, response} = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require('../models/users');


const validateAccessByJWT = async (  req = request, res, next ) => {

    const token = req.header('CP_TOKEN');
    const path = req.baseUrl;
    const method = req.method;

    try {

        if ( !token ) {
            return res.status(401).json({ status: 401,  msg: "Unauthorized", description: 'Sin autorización' });
        }

        const { id } = jwt.verify( token, process.env.PRIVATE_SIGNATURE );
        const user = await UserModel.findById( id )

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