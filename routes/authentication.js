const express=require('express');
const router=express.Router();
const authController=require('../controller/authenitcationController')


//Registering new USER
router.post('/register',authController.register)


//Login existing USER
router.post('/login',authController.login)


module.exports=router;