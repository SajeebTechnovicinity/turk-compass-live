// Import necessary modules
const cityModel = require("../models/cityModel");
const { AuthUser } = require("../utils/helper");

// Define countryController methods
const cityController = {
    // Method to create a new city
    create: async (req, res) => {
        const { name,country,state } = req.body;
        try {
            const cityInfo = await cityModel.create({ name,country,state });
            res.status(201).send({
                success: true,
                message: "City Created Successfully",
                cityInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating city',
                error: error.message
            });
        }
    },
    edit: async (req, res) => {
        const { name,country,state,id} = req.body;
        try {
            const cityInfo = await cityModel.findOneAndUpdate({_id:id},{ name,country,state});
            res.status(201).send({
                success: true,
                message: "City updated Successfully",
                cityInfo
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: 'Error in creating city',
                error: error.message
            });
        }
    },

    // Method to list all citys
    list: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let state  = searchParams.get('state');
        try {
            let query={};
            if(state!=null){
                query={state:state};
            }
            const citys = await cityModel.find(query).populate([   
                {
                    'path':"country",
                    'model':'Country'
                },
                {
                    'path':"state",
                    'model':'State'
                },
            ]).sort({ name: 1, createdAt: -1 });
            res.status(200).send({
                success: true,
                message: "cities Retrieved Successfully",
                citys
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching citys',
                error: error.message
            });
        }
    },
     // Method to list all citys
    adminlist: async (req, res) => {
        //pagination start
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        //pagination end

        let state  = searchParams.get('state');
        try {
            let query={};
            if(state!=null){
                query={state:state};
            }

            // pagination start
            const count = await cityModel.countDocuments(query);     
            const totalPages = Math.ceil(count / limit);
            //pagination end

            const citys = await cityModel.find(query).populate([   
                {
                    'path':"country",
                    'model':'Country'
                },
                {
                    'path':"state",
                    'model':'State'
                },
            ]).sort({createdAt:-1}).skip(skip)
                .limit(limit);;
            res.status(200).send({
                success: true,
                message: "cities Retrieved Successfully",
                citys,
                totalPages,
                currentPage: page
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in fetching citys',
                error: error.message
            });
        }
    }
};

// Export cityController
module.exports = cityController;
