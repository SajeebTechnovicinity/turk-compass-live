const eventModel = require("../models/eventModel");
const { isBase64Image, uploadImageToCloudinary, AuthUser } = require("../utils/helper");

// Define durationSlotController methods
const eventController = {
    eventEditCreate: async (req, res) => {
        var {
            id,
            title,
            company,
            about_event,
            description,
            address,
            phone,
            website,
            banner,
            gallery,
            start_date,
            end_date
        } = req.body;
        var isbanerBase64 = await isBase64Image(banner);
        var updateInfo;
        if (isbanerBase64) {
            banner = await uploadImageToCloudinary(banner);
        }
        if (gallery) {
       
           gallery = await Promise.all(gallery.map(async (item) => {
                if (isBase64Image(item)) {
                    return await uploadImageToCloudinary(item);
                }
                return item;
            }));
        }

        var findEvent=false;
        if(id){
            findEvent = await eventModel.findOne({ _id: id });
        } 

        if (findEvent && id) {
            updateInfo = await eventModel.findOneAndUpdate({ _id: id }, {
                title,
                company,
                about_event,
                description,
                address,
                phone,
                website,
                banner,
                gallery,
                start_date,
                end_date
            })
        } else {
            updateInfo = await eventModel.create({
                title,
                company,
                about_event,
                description,
                address,
                phone,
                website,
                banner,
                gallery,
                start_date,
                end_date
            })
        }
        res.status(200).send({
            success: true,
            message: " Successfully updated",
            updateInfo
        });

    },
    getEvent: async (req, res) =>{
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        // const user_id = searchParams.get('user_id');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        let query = {}
        var eventList = await eventModel.find().sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    const count = await eventModel.find(query).countDocuments();
    const totalPages = Math.ceil(count / limit);

    res.status(200).send({
        success: true,
        message: " Successfully updated",
        totalPages,
        currentPage: page,
        eventList
    });
        
    }
};


// Export durationSlotController
module.exports = eventController;
