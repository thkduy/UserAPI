const router = require('express').Router();
const UserModel = require('../model/User');

router.get('/get-all-user', async (req, res)=>{
    res.send("success");
})

module.exports = router;