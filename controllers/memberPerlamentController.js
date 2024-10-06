// Import necessary modules
const memberPerlamantModel = require("../models/memberPerlamantModel");
const memberPerlamentModel = require("../models/memberPerlamantModel");
const { AuthUser,uploadImageToCloudinary } = require("../utils/helper");

// Define memberPerlamentController methods
const memberPerlamentController = {
    // Method to create a new memberPerlament
    create: async (req, res) => {
        let { name,image,cover_image,country,state,city,zip,political_affiliation,constituency,perferred_language,contact_email,contact_website,hill_office_house_of_commons,hill_office_telephone,hill_office_fax,constituency_office_main_office,constituency_telephone,constituency_fax } = req.body;
        
        //upload image & cover image
        image = await uploadImageToCloudinary(image);
        cover_image = await uploadImageToCloudinary(cover_image);
        
        try {
            const memberPerlamentInfo = await memberPerlamentModel.create({ name,image,cover_image,country,state,city,zip,political_affiliation,constituency,perferred_language,contact_email,contact_website,hill_office_house_of_commons,hill_office_telephone,hill_office_fax,constituency_office_main_office,constituency_telephone,constituency_fax });
            res.status(201).send({
                success: true,
                message: "Member of Perlament Created Successfully",
                memberPerlamentInfo
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


    // Method to create a new memberPerlament
    edit: async (req, res) => {
        let { name,image,cover_image,country,state,city,zip,political_affiliation,constituency,perferred_language,contact_email,contact_website,hill_office_house_of_commons,hill_office_telephone,hill_office_fax,constituency_office_main_office,constituency_telephone,constituency_fax } = req.body;
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let id = searchParams.get('id');

        let memberPerlamentInfo = await memberPerlamentModel.findOne({_id:id});
        
        //upload image & cover image
        if(image!=null)
        {
            image = await uploadImageToCloudinary(image);
        }
        else
        {
            image = memberPerlamentInfo.image;
        }
        if(cover_image!=null)
        {
            cover_image = await uploadImageToCloudinary(cover_image);
        }
        else
        {
            cover_image = memberPerlamentInfo.cover_image;
        }
        
        try {
            const memberPerlamentInfo = await memberPerlamentModel.findOneAndUpdate({_id:id},{ name,image,cover_image,country,state,city,zip,political_affiliation,constituency,perferred_language,contact_email,contact_website,hill_office_house_of_commons,hill_office_telephone,hill_office_fax,constituency_office_main_office,constituency_telephone,constituency_fax });
            res.status(201).send({
                success: true,
                message: "Member of Perlament Updated Successfully",
                memberPerlamentInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating memberPerlament',
                error: error.message
            });
        }
    },

    // Method to list all categories
    list: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 500;
        let skip = (page - 1) * limit;

        try {
            const count = await memberPerlamentModel.countDocuments();
       
            const totalPages = Math.ceil(count / limit);

            const memberPerlamants = await memberPerlamentModel.find().populate([   
                {
                    'path':"country",
                    'model':'Country'
                },
                {
                    'path':"state",
                    'model':'State'
                },
                {
                    'path':"city",
                    'model':'City'
                }
            ]).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            res.status(200).send({
                success: true,
                message: "Member of Perlaments Retrieved Successfully",
                totalPages,
                totalCount:count,
                currentPage: page,
                memberPerlamants
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching member of perlaments',
                error: error.message
            });
        }
    },

    // Method to list all categories
    details: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let id = searchParams.get('id');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;

        try {
            const count = await memberPerlamentModel.countDocuments();
       
            const totalPages = Math.ceil(count / limit);

            const memberPerlamants = await memberPerlamentModel.findOne({_id:id}).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            res.status(200).send({
                success: true,
                message: "Member of Perlaments Retrieved Successfully",
                totalPages,
                currentPage: page,
                memberPerlamants
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching member of perlaments',
                error: error.message
            });
        }
    },

    search: async (req, res) => {
        try {
            const info = new URL(req.url, `http://${req.headers.host}`);
            const searchParams = info.searchParams;
            let zip = searchParams.get('zip');
            let state = searchParams.get('state');
            let city = searchParams.get('city');
            let name = searchParams.get('name');
            let page = Number(searchParams.get('page')) || 1;
            let limit = Number(searchParams.get('limit')) || 12;
            let skip = (page - 1) * limit;
    
            let query = {};

 
            // // Check if both zip and state are provided
            // if (state!=null && zip!=null) {
            //     if(state=="all")
            //     {
            //         query = {zip:zip};
            //     }
            //     else
            //     {
            //         query = {
            //             state: state,                  
            //             zip: zip, // Case-insensitive regex match for zip                 
            //         };
            //     }
            //     console.log("state & zip");
            // }
            // else if(zip!=null)
            // {
            //     query = {
                  
            //         zip: zip, // Case-insensitive regex match for zip
                    
            //     };
            // }
            // else if(state!=null)
            // {
            //     if(state=="all")
            //     {
            //         query = {};
            //     }
            //     else
            //     {
            //         query = {
            //             state: state               
            //         };
            //     }
            // }
            // else {
            //     // default all business post
            //     query = {};
            // }

            if (state!=null && state!='') {
                if(state!="all")
                {
                    query.state =state;
                }
            }
            if (city!=null && city!='') {
                if(city!="all")
                {
                    query.city =city;
                }
            }
            if(zip!=null)
            {
                query.zip =  { $regex: zip, $options: "i" };
            }
            if(name !=null)
            {
                query.name = { $regex: name, $options: "i" };
            }

            console.log(query);

            const count = await memberPerlamentModel.countDocuments(query);
            
            const totalPages = Math.ceil(count / limit);
    
            const memberPerlamants = await memberPerlamentModel.find(query).populate([
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
                message: "Member of Perlaments Retrieved Successfully",
                totalPages,
                currentPage: page,
                memberPerlamants
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Error in fetching member of perlaments",
                error: error.message
            });
        }
    },
    delete:async (req, res) =>{
        try{
          const info = new URL(req.url, `http://${req.headers.host}`);
          const searchParams = info.searchParams;
          let id = searchParams.get('id');
          let member=await memberPerlamantModel.deleteOne({_id:id});
            res.status(200).send({
                success: true,
                message: 'Successfully Deleted',
            });
        }catch (error) {
            console.log(error);
            res.status(200).send({
                success: false,
                message: error.message,
                error: error.message
            });
        }
    }

};

// Export memberPerlamentController
module.exports = memberPerlamentController;
