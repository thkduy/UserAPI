const router = require('express').Router();
const jwt = require('jsonwebtoken');

router.get('/activate', (req,res)=>{
    const token = req.body.token;

    try{
        const data = jwt.verify(token,process.env.TOKEN_SECRET);
        res.send(data);
    } catch(error){
        
    }
    
});

module.exports = router;