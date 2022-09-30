const { Router } = require('express');
const User = require('../../controllers/v1/users');
const { check } = require('express-validator');
const { roleValidator, emailValidator, idUserValidator,
statusValidator, dniValidator, emailEditValidator} = require('../../helpers/dbValidator');
const { validateFields } = require('../../middlewares/fields_middlewares');
const router = Router();
const user = new User();

router.get('/',( req , res ) =>{ user.getAllUser(req,res) });

router.get('/:id',[
    check('id','not a mongodb id').isMongoId(),
    check('id').custom( idUserValidator ),
    validateFields
    ],( req , res ) =>{ user.getUser(req,res) });

//falta validar correos 
router.post('/',[
    check('name','The name is required').not().isEmpty(),
    check('lastName','The last name is required').not().isEmpty(),
    check('email','The email is not valid').isEmail(),
    check('email').custom( emailValidator ),
    check('password','The password must have a minimum of 8 characters.').isLength({ min: 8 }),
    check('role').custom( roleValidator ),
    check('dni').custom( dniValidator ),
    validateFields
    ],( req , res ) =>{ user.postUser(req,res) });

router.put('/:id',[
    check('id','not a mongodb id').isMongoId(),
    check('id').custom( idUserValidator ),
    check('email').custom( emailEditValidator ),
    validateFields
    ],( req , res ) =>{ user.putUser(req,res) });


router.delete('/:id',[
    check('id','not a mongodb id').isMongoId(),
    check('id').custom( idUserValidator ),
    check('id').custom( statusValidator ),
    validateFields
    ],( req , res ) =>{ user.deleteUser(req,res) });


module.exports = router;