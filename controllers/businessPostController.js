// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const userModel = require("../models/userModel");
const bcrypt= require('bcrypt');
const { uploadImageToCloudinary } = require("../utils/helper");
const { AuthUser } = require("../utils/helper");

// Define businessPostController methods
const businessPostController = {
    // Method to create a new businessPost
    create: async (req, res) => {
        let { user_id,user_name,email,password,category,sub_category,business_name,description,image,cover_image,address,country,state,city,contact_address,contact_located_in,contact_phone,contact_website,is_reservation_available } = req.body;
        try {
            if(user_name!=null & email!=null && password!=null)
            {
                // check 
                const exisiting=await userModel.findOne({email});
                    
                if(exisiting){
                    return res.status(500).send({
                        success:false,
                        message:'Email already Registerd'
                    })
                }
                //hashing the password
                const hashPassword = await bcrypt.hash(password, 10);

                const userInfo = await userModel.create({ userName:user_name,email,password:hashPassword,usertype:'business-owner' });

                user_id=userInfo._id;
            }
            else
            {
                const user_info= await AuthUser(req);
                user_id=user_info.id;
            }
            

            //upload image & cover image
            image = await uploadImageToCloudinary(image);
            cover_image = await uploadImageToCloudinary(cover_image);
   
            const businessPostInfo = await businessPostModel.create({ user:user_id,category,sub_category,country,state,city,business_name,description,image,cover_image,address,country,state,city,contact_address,contact_located_in,contact_phone,contact_website,is_reservation_available });
            res.status(201).send({
                success: true,
                message: "Business Post Created Successfully",
                businessPostInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating business post',
                error: error.message
            });
        }
    },

    list: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let sub_category = searchParams.get('sub_category');
            let page = Number(searchParams.get('page')) || 1;
            let limit = Number(searchParams.get('limit')) || 12;
            let skip = (page - 1) * limit;

            let query = {};

            if(sub_category!=null)
            {
                query={sub_category:sub_category};
            }
    
            const count = await businessPostModel.countDocuments(query);
            
            const totalPages = Math.ceil(count / limit);
    
            const businessPosts = await businessPostModel.find(query)
                .populate([
                    { path: "category", model: "Category" },
                    { path: "sub_category", model: "SubCategory" },
                    { path: "user", model: "User" },
                    { path: "country", model: "Country" },
                    { path: "state", model: "State" },
                    { path: "city", model: "City" }
                ])
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
    
            res.status(200).send({
                success: true,
                message: "Business Posts Retrieved Successfully",
                totalPages,
                currentPage: page,
                businessPosts
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching categories',
                error: error.message
            });
        }
    },
    

    search: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let sub_category = searchParams.get('sub_category');
            let page = Number(searchParams.get('page')) || 1;
            let limit = Number(searchParams.get('limit')) || 12;
            let skip = (page - 1) * limit;

            const { city, name} = req.body;
    
            let query = {};

            console.log(name);

    
            // Check if both city and name are provided
            if (city!=null && name!=null) {
                query = {
                    city: city,
                    $or: [
                        { business_name: { $regex: `.*${name}.*`, $options: 'i' } }, // Case-insensitive regex match for name
                        { description: { $regex: `.*${name}.*`, $options: 'i' } } // Case-insensitive regex match for description
                    ]
                };
            }
            else if(name!=null)
            {
                query = {
                    $or: [
                        { business_name: { $regex: `.*${name}.*`, $options: 'i' } }, // Case-insensitive regex match for name
                        { description: { $regex: `.*${name}.*`, $options: 'i' } } // Case-insensitive regex match for description
                    ]
                };
            }
            else if(city!=null)
            {
                query = {
                    city: city
                };
            }
            else {
                // default all business post
                query = {};
            }

            const count = await businessPostModel.countDocuments(query);
            
            const totalPages = Math.ceil(count / limit);
    
            const businessPosts = await businessPostModel.find(query).populate([
                {
                    path: "category",
                    model: "Category"
                },
                {
                    path: "sub_category",
                    model: "SubCategory"
                },
                {
                    path: "user",
                    model: "User"
                },
                {
                    path: "country",
                    model: "Country"
                },
                {
                    path: "state",
                    model: "State"
                },
                {
                    path: "city",
                    model: "City"
                }
            ]).sort({createdAt:-1}) .skip(skip)
                .limit(limit);;
    
            res.status(200).send({
                success: true,
                message: "Business Posts Retrieved Successfully",
                totalPages,
                currentPage: page,
                businessPosts
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error in fetching categories",
                error: error.message
            });
        }
    }
    
};

// Export businessPostController
module.exports = businessPostController;
