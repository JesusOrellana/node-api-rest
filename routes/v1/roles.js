const { Router } = require('express');
const Role = require('../../controllers/v1/roles');
const { check } = require('express-validator');
const { validateFields } = require('../../middlewares/fields_middlewares');
const { validateAccessByJWT } = require('../../middlewares/jwt_middlewares');
const router = Router();
const role = new Role();

router.use(validateAccessByJWT);

router.get('/',( req , res ) =>{ role.getAllRole(req,res) });

router.get('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ role.getRole(req,res) });

router.post('/',[
    check('name','name is required').not().isEmpty(),
    validateFields
    ],( req , res ) =>{ role.postRole(req,res) });

router.put('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ role.putRole(req,res) });

router.delete('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ role.deleteRole(req,res) });

module.exports = router;