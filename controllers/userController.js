// Import necessary modules

const userModel = require("../models/userModel");

const userController={
    getUser: async (req, res) => {
        try {
            const userInfo = await userModel.find();
            if(userInfo){
                res.status(200).send({
                    success: true,
                    userInfo
                });
            }else{
                res.status(500).send({
                    success: false,
                    message: 'Error',
                    error: error.message
                });
            }
        }catch(error){
            console.error("Error in testUserController:", error);
       
    
        }
    },
}



// Export categoryController
module.exports = userController;
