const User = require("../models/user")
const { generateHash } = require('../helpers/hash')
const adminPassword = process.env.ADMIN_PASSWORD;
let hashedPassword = null;

const createAdmin = async () => {
    return new Promise(async (Resolve, Reject)=>{
        // Validate generated hash
        await generateHash(adminPassword).then((data)=>{
            hashedPassword=data;
        }).catch((err)=>{
            console.log(err);
        });

        const adminUser = {
            first_name: process.env.ADMIN_FIRST_NAME,
            last_name: process.env.ADMIN_LAST_NAME,
            password: hashedPassword,
            email: process.env.ADMIN_EMAIL,
            user_type: "admin"
        }

        await User.syncIndexes();
        if(process.env.ADMIN_RENEW=="yes") {
            await User.findOneAndUpdate({ email: process.env.ADMIN_EMAIL }, async (err, data)=>{
                if(data){
                    console.log("Error creating admin user, it may already exist!")
                    Reject(null);
                } else {
                    await User.create( adminUser,(err, result) => {
                        if(err){
                            console.log("Error creating admin user, it may already exist!")
                            Reject(null);
                        } else {
                            console.log("Created admin user successfully!")
                            Resolve(null);
                        }
                    })
                }
            });
        } else {
            await User.findOne({ email: process.env.ADMIN_EMAIL }, async (err, data)=>{
                if(data){
                    console.log("Error creating admin user, it may already exist!")
                    Reject(null);
                } else {
                    await User.create( adminUser,(err, result) => {
                        if(err){
                            console.log("Error creating admin user, it may already exist!")
                            Reject(null);
                        } else {
                            console.log("Created admin user successfully!")
                            Resolve(null);
                        }
                    })
                }
            });
        }
    })
}

module.exports = {createAdmin}