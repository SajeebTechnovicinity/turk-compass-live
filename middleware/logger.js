const userModel = require("../models/userModel");
const { AuthUser } = require("../utils/helper");

async function requestLogger(req, res, next) {
    try {
        const user_info = await AuthUser(req);
        if(user_info){
            const user_id = user_info.id;
            var user_data=await userModel.findOne({_id:user_id});
            if(user_data&&user_data.is_delete){
                res.status(401).send(
                    {
                        success:false,
                        message:"Your account has been deactivated",
                    }
                )
                return;
            }else{
                next();
            }
        }
      else{
        res.status(401).send(
            {
                success:false,
                message:"Login first",
            }
        )
      }
    } catch (error) {
        // Handle any errors that occur during the asynchronous operation
        console.error('Error in requestLogger middleware:', error);
        next(error); // Pass the error to the next middleware function or error handler
    }
}

module.exports = requestLogger;