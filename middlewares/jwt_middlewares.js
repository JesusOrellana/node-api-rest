const { request, response} = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require('../models/users');
const AccessModel = require('../models/access');
const RolAccessModel = require('../models/role_access');
const error_log = require("../helpers/error");

const validateAccessByJWT = async (  req = request, res, next ) => {

    const token = req.header('CP_TOKEN');
    const path = req.baseUrl;
    const method = req.method;

    try {

        if ( !token ) {
            error_log('Unauthorized','Sin autorización','jwt_middlewares.js validateAccessByJWT');
            return res.status(401).json({ status: 401,  msg: "Unauthorized", description: 'Sin autorización' });
        }

        const { uid } = jwt.verify( token, process.env.PRIVATE_SIGNATURE );
        console.log("🚀 ~ file: jwt_middlewares.js ~ line 21 ~ validateAccessByJWT ~ uid", uid)

        const user = await UserModel.findById( uid )
        .populate({path: 'role', select: 'name'})
        console.log("🚀 ~ file: jwt_middlewares.js ~ line 25 ~ validateAccessByJWT ~ user", user)
        if ( !user ) {

            error_log('Unauthorized','El usuario no existe','jwt_middlewares.js validateAccessByJWT');
            return res.status(401).json({ status: 401, msg: "Unauthorized", description: 'El usuario no existe' });

        }
        if ( user.role.name != 'ADMIN_ROLE' ) {

            if (user.status == 0 ) {

                error_log('Unauthorized','Sin autorización status','jwt_middlewares.js validateAccessByJWT');
                return res.status(401).json({ status: 401, msg: "Unauthorized", description: 'Sin autorización status' });
            
            }
            else {

                const access = await AccessModel.findOne( { module: path } )
                console.log(access);
                const rolAccess = await RolAccessModel.findOne( { role: user.role._id, access: access._id } );
                console.log("🚀 ~ file: jwt_middlewares.js ~ line 46 ~ validateAccessByJWT ~ rolAccess", rolAccess)

                let flag = false;

                console.log(method);

                if (rolAccess) {
                    switch (method) {
                        case 'GET':
                            flag = rolAccess.read;
                            console.log(rolAccess.read);
                            break;
                        case 'POST':
                            flag = rolAccess.create;
                            break;
                        case 'PUT':
                            flag = rolAccess.update;
                            break;
                        case 'DELETE':
                            flag = rolAccess.delete;
                            break;
                        default:
                            flag = false
                        break;
                    }

                    if( flag ) {
                        req.user = user
                        next() 
                    }
                    else {
    
                        error_log('Unauthorized','Usuario sin accesos al modulo','jwt_middlewares.js validateAccessByJWT');
                        return res.status(401).json({ status: 401,  msg: "Unauthorized", description: 'Usuario sin accesos al modulo' });
    
                    }

                } else {
                    error_log('Unauthorized','Usuario sin accesos al modulo','jwt_middlewares.js validateAccessByJWT');
                    return res.status(401).json({ status: 401,  msg: "Unauthorized", description: 'Usuario sin accesos al modulo' });
                }

            }
            
            
        }
        else {
            req.user = user;
            next();
        }

        

    } catch (error) {

        error_log(error,'El Token no es valido','jwt_middlewares.js validateAccessByJWT');
        return res.status(401).json({ status: 401, msg: 'Unauthorized', description: 'El Token no es valido' });

    }
}

module.exports = { validateAccessByJWT };