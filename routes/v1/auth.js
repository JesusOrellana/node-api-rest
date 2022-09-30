const { Router, response } = require('express');
const { check } = require('express-validator');
const { roleValidator, emailValidator, idUserValidator} = require('../../helpers/dbValidator');
const { validateFields } = require('../../middlewares/fields_middlewares');
const router = Router();
const Auth = require('../../controllers/v1/auth');
const auth = new Auth();

router.post('/login',[
    check('email','Mailing is required').isEmail(),
    check('password','Password is required').not().isEmpty(),
    validateFields
    ],( req , res ) =>{ auth.login( req, res ) });

router.post('/google',[
    check('id_token','The id_token is required').not().isEmpty(),
    validateFields
    ],( req , res ) =>{ auth.googleSignIn( req, res ) });

router.post('/verify',[
    check('id_token','The id_token is required').not().isEmpty(),
    validateFields
    ],( req , res ) =>{ auth.verifyToken( req, res ) });


router.post('/create',[
        check('email','Mailing is required').isEmail(),
        check('password','Password is required').not().isEmpty(),
        check('email').custom(emailValidator),
        validateFields
        ],( req , res ) =>{ auth.createAccount( req, res ) });
module.exports = router;