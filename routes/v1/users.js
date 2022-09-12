const { Router } = require("express");
const { check } = require('express-validator');
const router = Router();
const User = require('../../controllers/v1/users');
const { idUserValidator, roleValidator } = require("../../helpers/dbValidator");
const { validateFields } = require("../../middlewares/fields_middlewares");
const { validateAccessByJWT } = require("../../middlewares/jwt_middlewares");
const  user = new User();

router.use( validateAccessByJWT );

router.get('/:id',
[
    check('id','el identificador del usuario debe ser un numero').isNumeric(),
    check('id').custom(idUserValidator),
    validateFields

], (req,res) => {user.getUser(req,res)});

router.get('/', (req,res) => {user.getAllUser(req,res)});

router.post('/',
[
    check('name','el nombre del usuario es obligatorio').not().isEmpty(),
    check('lastName','el apellido del usuario es obligatorio').not().isEmpty(),
    check('email','el correo del usuario es obligatorio').not().isEmpty(),
    check('phone','el numero telefónico del usuario es obligatorio').not().isEmpty(),
    check('phone','el numero telefónico del usuario debe ser un numero').isNumeric(),
    check('dni','el dni del usuario es obligatorio').not().isEmpty(),
    check('dateBirth','la fecha de nacimiento del usuario es obligatoria').not().isEmpty(),
    check('role','el role del usuario es obligatorio').not().isEmpty(),
    check('role').custom(roleValidator),
    validateFields

], (req,res) => {user.postUser(req,res)});

router.put('/:id',
[
    check('id','el identificador del usuario debe ser un numero').isNumeric(),
    check('id').custom(idUserValidator),
    validateFields

], (req,res) => {user.putUser(req,res)});

router.delete('/:id',
[
    check('id','el identificador del usuario debe ser un numero').isNumeric(),
    check('id').custom(idUserValidator),
    validateFields

], (req,res) => {user.deleteUser(req,res)});


module.exports = router;


