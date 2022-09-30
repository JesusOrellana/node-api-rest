const Role = require('../models/roles');
const User = require('../models/users');

//=================================================================
//USER VALIDATORS
//=================================================================
var uid ;
const roleValidator = async ( id = '' ) => {
    const roleValid = await Role.findById( id );
    if( !roleValid ){
        throw new Error(`The role is not registered in the DB`);
    }
}

const emailValidator = async ( email = '' ) => {
    const emailValid = await User.findOne({ email });
    if( emailValid ){
        throw new Error(`Mail ${ email } is already registered`);
    }
}

const emailEditValidator = async ( email = '' ) => {
    if( email != '' ){
        const emailValid = await User.findOne({ email });
        if( emailValid ){
            if(uid != emailValid.uid ){
                throw new Error(`The Mail ${ email } is already registered with another user`);
            }
        }
    }
}

const idUserValidator = async ( id = '' ) => {
    uid = id;
    const idValid = await User.findById( id );
    if( !idValid ){
        throw new Error(`User does not exist`);
    }
}

const statusValidator = async ( id = '' ) => {
    const user = await User.findById( id );
    if( !user.status ){
        throw new Error(`The User is already deactivated`);
    }
}

const dniValidator = async ( dni = '' ) => {
    const user = await User.findOne( { dni: dni } );
    if( user ){
        throw new Error(`The dni ${ dni } is already registered`);
    }
}

module.exports = { 
    roleValidator,
    emailValidator, 
    emailEditValidator,
    idUserValidator, 
    statusValidator,
    dniValidator
};