const { validationResult } = require('express-validator');

const validateFields = ( req, res, next) => {

    //Validación de campos
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status( 400 ).json( {  status: 400, msg: "Bad Request",description: errors.errors[0].msg  } );
    }

    next();
}

module.exports = { validateFields }