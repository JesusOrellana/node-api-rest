const { Router } = require("express");
const { check } = require('express-validator');
const router = Router();
const Access = require('../../controllers/v1/access');
const { accessValidator, accessNameValidator } = require("../../helpers/dbValidator");
const { validateFields } = require("../../middlewares/fields_middlewares");
const { validateAccessByJWT } = require("../../middlewares/jwt_middlewares");
const  access = new Access();

router.use( validateAccessByJWT );

router.get('/:id',
[
    check('id','el identificador del acceso debe ser un numero').isNumeric(),
    check('id').custom(accessValidator),
    validateFields

], (req,res) => {access.getAccess(req,res)});

router.get('/', (req,res) => {access.getAllAccess(req,res)});

router.post('/',
[
    check('module','el modulo del acceso es obligatorio').not().isEmpty(),
    check('module').custom(accessNameValidator),
    validateFields

], (req,res) => {access.postAccess(req,res)});

router.put('/:id',
[
    check('id','el identificador del acceso debe ser un numero').isNumeric(),
    check('id').custom(accessValidator),
    check('module').custom(accessNameValidator),
    validateFields

], (req,res) => {access.putAccess(req,res)});

router.delete('/:id',
[
    check('id','el identificador del acceso debe ser un numero').isNumeric(),
    check('id').custom(accessValidator),
    validateFields

], (req,res) => {access.deleteAccess(req,res)});


module.exports = router;


