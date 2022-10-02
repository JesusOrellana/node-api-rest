const { Router } = require('express');
const RoleAccess = require('../../controllers/v1/role_access');
const { check } = require('express-validator');
const { validateFields } = require('../../middlewares/fields_middlewares');
const { validateAccessByJWT } = require('../../middlewares/jwt_middlewares');
const router = Router();
const roleAccess = new RoleAccess();

router.use(validateAccessByJWT);

router.get('/',( req , res ) =>{ roleAccess.getAllRoleAccess(req,res) });

router.get('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ roleAccess.getRoleAccess(req,res) });

router.post('/',[
    check('role','role is required').not().isEmpty(),
    check('role','role is required').isMongoId(),
    check('access','access is required').not().isEmpty(),
    check('access','access is required').isMongoId(),
    validateFields
    ],( req , res ) =>{ roleAccess.postRoleAccess(req,res) });

router.put('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ roleAccess.putRoleAccess(req,res) });

router.delete('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ roleAccess.deleteRoleAccess(req,res) });

module.exports = router;