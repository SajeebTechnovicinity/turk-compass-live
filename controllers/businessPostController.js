// Import necessary modules
const businessPostModel = require("../models/businessPostModel");
const userModel = require("../models/userModel");
const bcrypt= require('bcrypt');
const { uploadImageToCloudinary } = require("../utils/helper");
const { AuthUser } = require("../utils/helper");
const whistlistModel = require("../models/whistlistModel");

// Define businessPostController methods
const businessPostController = {
    // Method to create a new businessPost
    create: async (req, res) => {
        let { user_id,user_name,email,password,tag,contact_email,speciality,category,sub_category,business_name,description,image,cover_image,address,country,state,city,contact_address,contact_located_in,contact_phone,contact_website } = req.body;
        console.log(req.body);
        try {
            let is_reservation_available;
            let is_multiple_reservation_available;
            if(user_name!=null & email!=null && password!=null)
            {
                // check 
                const exisiting=await userModel.findOne({email});
                    
                if(exisiting){
                    return res.status(200).send({
                        success:false,
                        message:'Email already Registerd'
                    })
                }
                //hashing the password
                const hashPassword = await bcrypt.hash(password, 10);

                const userInfo = await userModel.create({ userName:user_name,email,password:hashPassword,usertype:'business-owner' });

                user_id=userInfo._id;
                is_multiple_reservation_available=userInfo.is_multiple_reservation_available;
                is_reservation_available=userInfo.is_reservation_available;
            }
            else
            {
                const user_info= await AuthUser(req);
                user_id=user_info.id;
                is_multiple_reservation_available=user_info.is_multiple_reservation_available;
                is_reservation_available=user_info.is_reservation_available;
            }

            let businessPostCount=await businessPostModel.countDocuments({user:user_id});
            console.log(businessPostCount);

            if(businessPostCount>0)
            {
                return res.status(200).send({
                    success: false,
                    message: 'Already a business post created for this user'
                });
            }
            

            //upload image & cover image
            image = await uploadImageToCloudinary(image);
            cover_image = await uploadImageToCloudinary(cover_image);

   
            const businessPostInfo = await businessPostModel.create({ user:user_id,contact_email,tag,category,sub_category,speciality,country,state,city,business_name,description,image,cover_image,address,country,state,city,contact_address,contact_located_in,contact_phone,contact_website,is_reservation_available,is_multiple_reservation_available });
            res.status(201).send({
                success: true,
                message: "Business Post Created Successfully",
                businessPostInfo
            });
        } catch (error) {
            console.log(error);
            res.status(200).send({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    },

    // Method to edit businessPost
    edit: async (req, res) => {
        let { tag,contact_email,speciality,category,sub_category,business_name,description,image,cover_image,address,country,state,city,contact_address,contact_located_in,contact_phone,contact_website } = req.body;
        console.log(req.body);
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let businessPostId = searchParams.get('id');
            let is_reservation_available;
            let is_multiple_reservation_available;
          
            let businessPostCount=await businessPostModel.countDocuments({_id:businessPostId});
            if(businessPostCount==0)
            {
                res.status(200).send({
                    success: false,
                    message: "No Business Post available"
                });
            }
            let businessPostDetails=await businessPostModel.findOne({_id:businessPostId});


            //upload image & cover image
            if(image!=null)
            {
                image = await uploadImageToCloudinary(image);
            }
            else
            {
                image = businessPostDetails.image;
            }
            if(cover_image!=null)
            {
                cover_image = await uploadImageToCloudinary(cover_image);
            }
            else
            {
                cover_image = businessPostDetails.cover_image;
            }

   
            const businessPostInfo = await businessPostModel.findOneAndUpdate({_id:businessPostDetails._id},{ contact_email,tag,category,sub_category,speciality,country,state,city,business_name,description,image,cover_image,address,country,state,city,contact_address,contact_located_in,contact_phone,contact_website,is_reservation_available,is_multiple_reservation_available });
            res.status(201).send({
                success: true,
                message: "Business Post Updated Successfully",
                businessPostInfo
            });

        } catch (error) {
            console.log(error);
            res.status(200).send({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    },

    list: async (req, res) => {
        try {
            const user_info = await AuthUser(req);
            const userId = user_info.id;

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

            // Check if each business post is in the user's wishlist
            const businessPostsWithWishlistInfo = await Promise.all(businessPosts.map(async (post) => {
                const wishlistEntry = await whistlistModel.countDocuments({
                    user: userId,
                    business_post: post._id
                });

                return {
                    ...post.toObject(),
                    is_wishlist: wishlistEntry
                };
            }));
    
            res.status(200).send({
                success: true,
                message: "Business Posts Retrieved Successfully",
                totalPages,
                currentPage: page,
                businessPosts:businessPostsWithWishlistInfo
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
                        { description: { $regex: `.*${name}.*`, $options: 'i' } } ,// Case-insensitive regex match for description
                        { tag: { $regex: `.*${name}.*`, $options: 'i' } }
                    ]
                };
            }
            else if(name!=null)
            {
                query = {
                    $or: [
                        { business_name: { $regex: `.*${name}.*`, $options: 'i' } }, // Case-insensitive regex match for name
                        { description: { $regex: `.*${name}.*`, $options: 'i' } }, // Case-insensitive regex match for description
                        { tag: { $regex: `.*${name}.*`, $options: 'i' } }
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
    },

    details: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let user_id = searchParams.get('user_id');

            const profile = await userModel.findById(user_id);
            const businessProfile=await businessPostModel.findOne({user:user_id});
    
            res.status(200).send({
                success: true,
                message: "User Profile Retrieved Successfully",
                businessProfile
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

    idWiseDetails: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let id = searchParams.get('id');

            const profile = await userModel.findById(user_id);
            const businessProfile=await businessPostModel.findOne({_id:id});
    
            res.status(200).send({
                success: true,
                message: "User Profile Retrieved Successfully",
                businessProfile
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching categories',
                error: error.message
            });
        }
    }
    
};

// Export businessPostController
module.exports = businessPostController;
