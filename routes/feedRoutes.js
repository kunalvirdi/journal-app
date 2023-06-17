const express=require('express');
const router=express.Router();
const feedController=require('../controller/feedController')


const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    if(authHeader!==undefined){
        const token=authHeader.split(' ')[1];
        if(!token){
            res.status(401).json({message:"Unauthorised user..."});
        }else{
            req.token=token;
            next();
        }

    }else{
        res.status(401).json({message:"Unauthorised user..."});
    }
}

router.get('/',verifyToken,feedController.getJournals)
//Create new Journal
router.post('/postJournal',verifyToken,feedController.createJournal)
//Delete Journal
router.post('/deleteJournal',verifyToken,feedController.deleteJournals);
//Update Journal
router.post('/updateJournal',verifyToken,feedController.updateJournal)

module.exports=router;