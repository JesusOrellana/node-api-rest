const { Router } = require('express');
const Access = require('../../controllers/v1/access');
const { check } = require('express-validator');
const { validateFields } = require('../../middlewares/fields_middlewares');
/* const { validateaccessByJWT } = require('../../middlewares/jwt_middlewares'); */
const router = Router();
const access = new Access();

/* router.use(validateaccessByJWT); */

router.get('/',( req , res ) =>{ access.getAllAccess(req,res) });

router.get('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ access.getAccess(req,res) });

router.post('/',[
    check('module','name is required').not().isEmpty(),
    validateFields
    ],( req , res ) =>{ access.postAccess(req,res) });

router.put('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ access.putAccess(req,res) });

router.delete('/:id',[
    check('id','not a mongodb id').isMongoId(),
    validateFields
    ],( req , res ) =>{ access.deleteAccess(req,res) });

module.exports = router;