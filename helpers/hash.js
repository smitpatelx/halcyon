const bcrypt = require('bcrypt');
const saltRounds = parseInt(process.env.SALT_ROUNDS);

//Create a admin password hash
const generateHash = async (adminPassword)=>{ 
    return new Promise((Resolve, Reject)=>{
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) throw (err);
            bcrypt.hash(adminPassword, salt, function(err, hash) {
                if(err) {
                    Reject({
                        error_message:"Error creating hash for admin password.", 
                        error_data:err
                    });
                } else {
                    Resolve(hash)
                }
            });
        });
    });
}

module.exports = {generateHash}