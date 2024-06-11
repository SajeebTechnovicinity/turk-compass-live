// Import necessary modules

const userModel = require("../models/userModel");

const userController = {
  getUser: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let skip = (page - 1) * limit;

    try {
      const count = await userModel.countDocuments(query);

      const totalPages = Math.ceil(count / limit);

      const userInfo = await userModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      if (userInfo) {
        res.status(200).send({
          success: true,
          userInfo,
          totalPages,
          currentPage: page,
        });
      } else {
        res.status(200).send({
          success: false,
          message: error.message,
          error: error.message,
        });
      }
    } catch (error) {
      console.error("Error in testUserController:", error);
    }
  },

  // Method to create a new businessPost
  create: async (req, res) => {
    let { user_name, email, password, package_type } = req.body;
    try {
      const exisiting = await userModel.findOne({ email });

      if (exisiting) {
        return res.status(200).send({
          success: false,
          message: "Email already Registerd",
        });
      }
      //hashing the password
      const hashPassword = await bcrypt.hash(password, 10);

      const userInfo = await userModel.create({
        userName: user_name,
        email,
        password: hashPassword,
        usertype: "client",
        package_type
      });

      res.status(201).send({
        success: true,
        message: "User Created Successfully",
        businessPostInfo,
      });
      
    } catch (error) {
      console.log(error);
      res.status(200).send({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  },
};

// Export categoryController
module.exports = userController;
