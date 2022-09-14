const { Router } = require("express");
const { check } = require('express-validator');
const router = Router();
const Role = require('../../controllers/v1/roles');
const { roleValidator, roleNameValidator } = require("../../helpers/dbValidator");
const { validateFields } = require("../../middlewares/fields_middlewares");
const { validateAccessByJWT } = require("../../middlewares/jwt_middlewares");
const  rol = new Role();

router.use( validateAccessByJWT );

router.get('/:id',
[
    check('id','el identificador del role debe ser un numero').isNumeric(),
    check('id').custom(roleValidator),
    validateFields

], (req,res) => {rol.getRole(req,res)});

router.get('/', (req,res) => {rol.getAllRole(req,res)});

router.post('/',
[
    check('name','el nombre del rol es obligatorio').not().isEmpty(),
    check('name').custom(roleNameValidator),
    validateFields

], (req,res) => {rol.postRole(req,res)});

router.put('/:id',
[
    check('id','el identificador del rol debe ser un numero').isNumeric(),
    check('id').custom(roleValidator),
    check('name').custom(roleNameValidator),
    validateFields

], (req,res) => {rol.putRole(req,res)});

router.delete('/:id',
[
    check('id','el identificador del rol debe ser un numero').isNumeric(),
    check('id').custom(roleValidator),
    validateFields

], (req,res) => {rol.deleteRole(req,res)});


module.exports = router;


