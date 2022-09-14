const db = require('../database/config');
const User = db.users;
const Role = db.roles;
const Access = db.access;
const Sequelize = db.sequelize;
const Op = db.sequelize.Op;

//=================================================================
//USER VALIDATORS
//=================================================================
var uid ;

const roleValidator = async ( id = '' ) => {
    const role = await Role.findByPk( id );
    if (role === null) {
        throw new Error(`El rol no existe`);
    } 
}

const roleNameValidator = async ( name = '' ) => {
    const role = await Role.findOne( { where: {name: name} });
    console.log(role);
    if (role) {
        throw new Error(`El nombre del rol ya existe`);
    } 
}

const emailValidator = async ( email = '' ) => {
    const emailValid = await User.findOne({ email });
    if( emailValid ){
        throw new Error(`El Correo ${ email } ya está registrado`);
    }
}

const emailEditValidator = async ( email = '' ) => {
    if( email != '' ){
        const emailValid = await User.findOne({ email });
        if( emailValid ){
            if(uid != emailValid.uid ){
                throw new Error(`El Correo ${ email } ya está registrado con otro usuario`);
            }
        }
    }
}

const idUserValidator = async ( id = '' ) => {

    const user = await User.findByPk( id );
    if (user === null) {
        throw new Error(`El Usuario no existe`);
    } 
}

const dniValidator = async ( dni = '' ) => {
    const user = await User.findOne( {where:{ dni: dni } });
    if( user ){
        throw new Error(`El dni ${ dni } ya se encuentra registrado`);
    }
}
//=================================================================
//ACCESS VALIDATORS
//=================================================================

const accessValidator = async ( id = '' ) => {
    const access = await Access.findByPk( id );
    if (access === null) {
        throw new Error(`El acceso no existe`);
    } 
}

const accessNameValidator = async ( module = '' ) => {
    const access = await Access.findOne( { where: {module: module} });
    console.log(access);
    if (access) {
        throw new Error(`El nombre del modulo de acceso ya existe`);
    } 
}




module.exports = { 
    roleNameValidator,
    roleValidator,
    emailValidator, 
    emailEditValidator,
    idUserValidator, 
    dniValidator,
    accessValidator,
    accessNameValidator
};