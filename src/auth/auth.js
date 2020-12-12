const express = require('express');
const router = express.Router();
const User = require('../../models/user')
const AuthToken = require('../../models/authtokens')
const { validateLogin, generateToken, getRefreshToken } = require('../../helpers/auth')
const bcrypt = require('bcrypt')
/*  
 * POST - Login Route
 * @accept - email, password
 * @return token, refreshToken
*/
router.post('/login', validateLogin, async (req, res) => {
    await User.findOne({ email: req.body.email }).then(data=>{
        bcrypt.compare(req.body.password, data.password, async function(err, result) {
            if(result == true){
                let userObj = data.toObject();
                delete userObj["password"];    // Deleting password

                // Generating new token
                await generateToken(data).then(data=>{
                    res.status(200).json(data);
                }).catch(error=>{
                    res.status(401).json({error_message:"Error generating Token", error_data:error})
                })
            } else {
                res.status(401).json({error_message:"User login failed!", error_data: err});
            }
        });
    });
});

/*
 * POST - Refresh Token
 * @accept - refreshToken
 * @return - accessToken
 */
router.post('/refresh', async(req, res)=>{
    const {refreshToken} = req.body;
    await getRefreshToken(refreshToken).then(data=>{
        res.status(200).json(data);
    }).catch(err=>{
        res.status(403).json({error_message:"Please try again!", error_data: err})
    })
})

module.exports = router