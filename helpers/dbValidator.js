const db = require('../database/config');
const User = db.users;
const Role = db.roles;
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

const statusValidator = async ( id = '' ) => {
    const user = await User.findById( id );
    if( !user.status ){
        throw new Error(`El Usuario ya se encuentra desactivado`);
    }
}

const dniValidator = async ( dni = '' ) => {
    const user = await User.findOne( { dni: dni } );
    if( user ){
        throw new Error(`El dni ${ dni } ya se encuentra registrado`);
    }
}
//=================================================================
//OWNER VALIDATORS
//=================================================================

const idOwnerValidator = async ( id = '' ) => {
    const idValid = await OwnerSmartContract.findById( id );
    if( !idValid ){
        throw new Error(`El Usuario no existe`);
    }
}

const addressValidator = async ( address = '' ) => {
    const addressValid = await OwnerSmartContract.findOne({ address });
    if( addressValid ){
        throw new Error(`La dirección de la wallet ${ address } ya está registrada`);
    }
}

//=================================================================
//CONTRACT VALIDATORS
//=================================================================

const idContractValidator = async ( id = '' ) => {
    const idValid = await SmartContract.findById( id );
    if( !idValid ){
        throw new Error(`El Contrato no existe`);
    }
}

const contractValidator = async ( address = '' ) => {
    const addressValid = await SmartContract.findOne({ address });
    if( addressValid ){
        throw new Error(`El contrato ${ address } ya está registrado`);
    }
}

const nameContractValidator = async ( name = '' ) => {
    const nameValid = await SmartContract.findOne({ name: name });
    if( nameValid ){
        throw new Error(`El nombre ${ name } ya está registrado`);
    }
}

const nameTokenValidator = async ( name = '' ) => {
    const nameValid = await SmartContract.findOne({ tokenName: name });
    if( nameValid ){
        throw new Error(`El nombre ${ name } ya está registrado`);
    }
}

const symbolTokenValidator = async ( symbol = '' ) => {
    const symbolValid = await SmartContract.findOne({ tokenSymbol: symbol });
    if( symbolValid ){
        throw new Error(`El símbolo ${ symbol } ya está registrado`);
    }
}

const numberValidator = async ( number = '0' ) => {

    if( Number(number) <= 0 ){
        throw new Error(`El precio y suministro del token debe ser mayor a cero`);
    }
}

//=================================================================
//TRANSACCTION VALIDATORS
//=================================================================
const secretValidator = async ( secret = '' ) => {

    if( secret != process.env.FLOW_INTER_SECRET_KEY ){
        throw new Error(`The auth is required`);
    }
}



module.exports = { 
    roleNameValidator,
    roleValidator,
    emailValidator, 
    emailEditValidator,
    idUserValidator, 
    statusValidator,
    dniValidator,
    idOwnerValidator, 
    addressValidator,
    idContractValidator,
    contractValidator,
    nameContractValidator,
    nameTokenValidator,
    symbolTokenValidator,
    numberValidator,
    secretValidator
};