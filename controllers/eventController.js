const mongoose = require("mongoose");
const eventModel = require("../models/eventModel");
const {
  isBase64Image,
  uploadImageToCloudinary,
  AuthUser,
} = require("../utils/helper");

// Define durationSlotController methods

async function getAllDatesInMonth(year, month, city_name) {
  let dates = [];
  let date = new Date(year, month - 1, 1);

  while (date.getMonth() === month - 1) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    let dateString = `${year}-${month}-${day}`;

    const dateSt = new Date(dateString);
    var eventList = await eventModel
      .aggregate([
        {
          $addFields: {
            startDate: { $toDate: "$start_date" },
            endDate: { $toDate: "$end_date" },
          },
        },
        {
          $match: {
            is_payment_complete: true,
            //city_name: city_name,
            is_delete: false,
            $and: [
              { startDate: { $lte: dateSt } },
              { endDate: { $gte: dateSt } },
            ],
          },
        },
        {
          $lookup: {
            from: "cities", // Ensure the collection name is correct
            localField: "city_id",
            foreignField: "_id",
            as: "city_id",
          },
        },
        {
          $unwind: {
            path: "$city_id",
            preserveNullAndEmptyArrays: true, // If you want to keep events without a city
          },
        },
        {
          $lookup: {
            from: "states", // Ensure the collection name is correct
            localField: "state_id",
            foreignField: "_id",
            as: "state_id",
          },
        },
        {
          $unwind: {
            path: "$state_id",
            preserveNullAndEmptyArrays: true, // If you want to keep events without a city
          },
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
            state_id:1,
            city_id: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .exec();
    if (eventList.length != 0) {
      dates.push({ date: dateString, eventList });
    }
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

const eventController = {
  eventEditCreate: async (req, res) => {
    try {
      const user_info = await AuthUser(req);
      const user_id = user_info.id;
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
        end_date,
        is_payment_complete,
        payment_date,
        payment_amount,
        payment_method,
        tnx_number,
        state_id,
        city_id,
      } = req.body;
      var isbanerBase64 = await isBase64Image(banner);
      var updateInfo;
      if (isbanerBase64) {
        banner = await uploadImageToCloudinary(banner);
      }
      if (gallery) {
        gallery = await Promise.all(
          gallery.map(async (item) => {
            if (isBase64Image(item)) {
              return await uploadImageToCloudinary(item);
            }
            return item;
          })
        );
      }
      let eventId;
      var findEvent = false;
      if (id) {
        findEvent = await eventModel.findOne({ _id: id });
      }

      if (findEvent && id) {
        eventId = id;
        let eventInfo= await eventModel.findOne({ _id: eventId });
        if(banner==null || banner=="")
        {
          banner=eventInfo.banner;
        }
        if (gallery==null || gallery=="") {
          gallery=eventInfo.gallery;
        }
        updateInfo = await eventModel.findOneAndUpdate(
          { _id: id },
          {
            title,
            user: user_id,
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
            end_date,
            is_payment_complete,
            payment_date,
            payment_amount,
            payment_method,
            tnx_number,
            state_id,
            city_id,
          }
        );
      } else {
        updateInfo = await eventModel.create({
          title,
          user: user_id,
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
          end_date,
          is_payment_complete,
          payment_date,
          payment_amount,
          payment_method,
          tnx_number,
          state_id,
          city_id,
        });
        eventId = updateInfo._id;
      }

      let stripePaymentUrl =
        process.env.APP_URL + `/api/v1/stripe/event-payment?id=${eventId}`;

      res.status(200).send({
        success: true,
        message: " Successfully updated",
        stripePaymentUrl: stripePaymentUrl,
        updateInfo,
      });
    } catch (error) {
      console.log(error);
      res.status(403).send({
        success: false,
        message: error.message,
        error: error.message,
      });
    }
  },
  getEvent: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    // const user_id = searchParams.get('user_id');
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let skip = (page - 1) * limit;
    let query = { is_delete: false, is_payment_complete: true };
    var eventList = await eventModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const count = await eventModel.find(query).countDocuments();
    const totalPages = Math.ceil(count / limit);

    res.status(200).send({
      success: true,
      message: " Successfully updated",
      totalPages,
      currentPage: page,
      eventList,
    });
  },

  getMonthEachDateEventList: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let monthStrGet = searchParams.get("month");
      let city_name = searchParams.get("city_name");
      let [month, year] = monthStrGet.split("/").map(Number);
      let datesInMonth = await getAllDatesInMonth(year, month, city_name);
      res.status(200).send({
        success: true,
        message: " Successfully updated",
        datesInMonth,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error  api",
        error: error,
      });
    }
  },
  getEventDateMonth: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    // const user_id = searchParams.get('user_id');
    let dateString = searchParams.get("date");
    let monthStrGet = searchParams.get("month");
    let city_name = searchParams.get("city_name");
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let skip = (page - 1) * limit;
    let query = {};
    if (monthStrGet) {
      let [month, year] = monthStrGet.split("/").map(Number);
      // Construct start and end dates
      const startDate = new Date(year, month - 1, 1); // Month is zero-indexed
      const endDate = new Date(year, month, 0); // Get the last day of the month
      var eventList = await eventModel
        .aggregate([
          {
            $addFields: {
              startYear: { $year: { $toDate: "$start_date" } },
              startMonth: { $month: { $toDate: "$start_date" } },
              endYear: { $year: { $toDate: "$end_date" } },
              endMonth: { $month: { $toDate: "$end_date" } },
            },
          },
          {
            $match: {
              is_payment_complete: true,
              //city_name: city_name,
              is_delete: false,
              $or: [
                {
                  $and: [{ startYear: year }, { startMonth: month }],
                },
                {
                  $and: [{ endYear: year }, { endMonth: month }],
                },
                {
                  $and: [
                    { startYear: { $lte: year } },
                    { endYear: { $gte: year } },
                    {
                      $or: [
                        {
                          startMonth: { $lte: month },
                          endMonth: { $gte: month },
                        },
                        { startYear: { $lt: year }, endYear: { $gt: year } },
                      ],
                    },
                  ],
                },
              ],
            },
          },
          {
            $lookup: {
              from: "cities", // Ensure the collection name is correct
              localField: "city_id",
              foreignField: "_id",
              as: "city_id",
            },
          },
          {
            $unwind: {
              path: "$city_id",
              preserveNullAndEmptyArrays: true, // If you want to keep events without a city
            },
          },
          {
            $lookup: {
              from: "states", // Ensure the collection name is correct
              localField: "state_id",
              foreignField: "_id",
              as: "state_id",
            },
          },
          {
            $unwind: {
              path: "$state_id",
              preserveNullAndEmptyArrays: true, // If you want to keep events without a city
            },
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
              state_id:1,
              city_id:1,
              is_delete: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ])
        .exec();
    }
    // // const totalPages = Math.ceil(count / limit);

    if (dateString) {
      const date = new Date(dateString);
      var eventList = await eventModel
        .aggregate([
          {
            $addFields: {
              startDate: { $toDate: "$start_date" },
              endDate: { $toDate: "$end_date" },
            },
          },
          {
            $match: {
              is_payment_complete: true,
              city_name: city_name,
              is_delete: false,
              $and: [
                { startDate: { $lte: date } },
                { endDate: { $gte: date } },
              ],
            },
          },
          {
            $lookup: {
              from: "cities", // Ensure the collection name is correct
              localField: "city_id",
              foreignField: "_id",
              as: "city_id",
            },
          },
          {
            $unwind: {
              path: "$city_id",
              preserveNullAndEmptyArrays: true, // If you want to keep events without a city
            },
          },
          {
            $lookup: {
              from: "states", // Ensure the collection name is correct
              localField: "state_id",
              foreignField: "_id",
              as: "state_id",
            },
          },
          {
            $unwind: {
              path: "$state_id",
              preserveNullAndEmptyArrays: true, // If you want to keep events without a city
            },
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
              state_id: 1,
              city_id:1,
              status: 1,
              is_delete: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        ])
        .exec();
    }

    res.status(200).send({
      success: true,
      message: " Successfully updated",
      eventList,
    });
  },
  myEvent: async (req, res) => {
    const info = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = info.searchParams;
    // const user_id = searchParams.get('user_id');
    let city_name = searchParams.get("city_name");
    let page = Number(searchParams.get("page")) || 1;
    let limit = Number(searchParams.get("limit")) || 12;
    let skip = (page - 1) * limit;
    let query = {};

    const user_info = await AuthUser(req);
    const user_id = user_info.id;

    var eventList = await eventModel
      .aggregate([
        {
          $addFields: {
            startYear: { $year: { $toDate: "$start_date" } },
            startMonth: { $month: { $toDate: "$start_date" } },
            endYear: { $year: { $toDate: "$end_date" } },
            endMonth: { $month: { $toDate: "$end_date" } },
          },
        },
        {
          $match: {
            user: new mongoose.Types.ObjectId(user_id),
            is_payment_complete: true,
            is_delete: false,
          },
        },
        {
          $lookup: {
            from: "cities", // Ensure the collection name is correct
            localField: "city_id",
            foreignField: "_id",
            as: "city_id",
          },
        },
        {
          $unwind: {
            path: "$city_id",
            preserveNullAndEmptyArrays: true, // If you want to keep events without a city
          },
        },
        {
          $lookup: {
            from: "states", // Ensure the collection name is correct
            localField: "state_id",
            foreignField: "_id",
            as: "state_id",
          },
        },
        {
          $unwind: {
            path: "$state_id",
            preserveNullAndEmptyArrays: true, // If you want to keep events without a city
          },
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
            state_id: 1,
            city_id: 1,
            status: 1,
            is_delete: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ])
      .exec();

    res.status(200).send({
      success: true,
      message: " Successfully updated",
      eventList,
    });
  },

  delete: async (req, res) => {
    try {
      const info = new URL(req.url, `http://${req.headers.host}`);
      const searchParams = info.searchParams;
      let id = searchParams.get("id");
      let member = await eventModel.findOneAndUpdate({ _id: id },{is_delete: true});
      res.status(200).send({
        success: true,
        message: "Successfully Deleted",
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

// Export durationSlotController
module.exports = eventController;
