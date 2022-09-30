const { Router } = require('express');
const router = Router();


router.get('/',( req , res ) =>{ res.status(200).json({ status: 200, msg: "Ok" }) });
router.get('/test',( req , res ) =>{ res.status(200).render('index') });

module.exports = router;