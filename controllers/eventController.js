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
            city_name,
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

        var findEvent = false;
        if (id) {
            findEvent = await eventModel.findOne({ _id: id });
        }

        if (findEvent && id) {
            updateInfo = await eventModel.findOneAndUpdate({ _id: id }, {
                title,
                company,
                city_name,
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
    getEvent: async (req, res) => {
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

    },

    getEventDateMonth: async (req, res) => {
        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        // const user_id = searchParams.get('user_id');
        let dateString = searchParams.get('date');
        let monthStrGet = searchParams.get('month');
        let page = Number(searchParams.get('page')) || 1;
        let limit = Number(searchParams.get('limit')) || 12;
        let skip = (page - 1) * limit;
        let query = {}
        if(monthStrGet){
            let [month, year] = monthStrGet.split('/').map(Number);
            // Construct start and end dates
            const startDate = new Date(year, month - 1, 1); // Month is zero-indexed
            const endDate = new Date(year, month, 0); // Get the last day of the month
            var eventList =  await eventModel.aggregate([
                {
                  $addFields: {
                    startYear: { $year: { $toDate: "$start_date" } },
                    startMonth: { $month: { $toDate: "$start_date" } },
                    endYear: { $year: { $toDate: "$end_date" } },
                    endMonth: { $month: { $toDate: "$end_date" } }
                  }
                },
                {
                  $match: {
                    $or: [
                      {
                        $and: [
                          { startYear: year },
                          { startMonth: month }
                        ]
                      },
                      {
                        $and: [
                          { endYear: year },
                          { endMonth: month }
                        ]
                      },
                      {
                        $and: [
                          { startYear: { $lte: year } },
                          { endYear: { $gte: year } },
                          {
                            $or: [
                              { startMonth: { $lte: month }, endMonth: { $gte: month } },
                              { startYear: { $lt: year }, endYear: { $gt: year } }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                },
                {
                  $project: {
                    _id: 1,
                    title: 1,
                    company: 1,
                    about_event: 1,
                    description: 1,
                    address: 1,
                    phone: 1,
                    website: 1,
                    banner: 1,
                    gallery: 1,
                    start_date: 1,
                    end_date: 1,
                    status: 1,
                    is_delete: 1,
                    createdAt: 1,
                    updatedAt: 1
                  }
                }
              ]).exec();

            //  update
            
            
            const startOfMonth = new Date(year, month - 1, 1);
            const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
          
            const events = await Event.aggregate([
              {
                $match: {
                  start_date: { $lte: endOfMonth },
                  end_date: { $gte: startOfMonth }
                }
              },
              {
                $project: {
                  title: 1,
                  company: 1,
                  about_event: 1,
                  description: 1,
                  address: 1,
                  phone: 1,
                  website: 1,
                  banner: 1,
                  gallery: 1,
                  start_date: 1,
                  end_date: 1,
                  status: 1,
                  is_delete: 1,
                  createdAt: 1,
                  updatedAt: 1,
                  date_range: {
                    $map: {
                      input: { $range: [0, { $add: [1, { $subtract: ['$end_date', '$start_date'] }] }] },
                      as: 'day',
                      in: { $add: ['$start_date', '$$day'] }
                    }
                  }
                }
              },
              { $unwind: '$date_range' },
              {
                $match: {
                  date_range: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                  }
                }
              },
              {
                $group: {
                  _id: { $dateToString: { format: '%Y-%m-%d', date: '$date_range' } },
                  events: { $push: '$$ROOT' }
                }
              },
              {
                $project: {
                  _id: 0,
                  date: '$_id',
                  event_list: '$events'
                }
              },
              {
                $sort: { date: 1 }
              }
            ]).exec();









        }

        // // const totalPages = Math.ceil(count / limit);

        if(dateString){
            const date = new Date(dateString);
            var eventList = await eventModel.aggregate([
              {
                $addFields: {
                  startDate: { $toDate: "$start_date" },
                  endDate: { $toDate: "$end_date" }
                }
              },
              {
                $match: {
                  $and: [
                    { startDate: { $lte: date } },
                    { endDate: { $gte: date } }
                  ]
                }
              },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  company: 1,
                  about_event: 1,
                  description: 1,
                  address: 1,
                  phone: 1,
                  website: 1,
                  banner: 1,
                  gallery: 1,
                  start_date: 1,
                  end_date: 1,
                  status: 1,
                  is_delete: 1,
                  createdAt: 1,
                  updatedAt: 1
                }
              }
            ]).exec();

        }

        res.status(200).send({
            success: true,
            message: " Successfully updated",
            eventList
        });

    }
};


// Export durationSlotController
module.exports = eventController;
