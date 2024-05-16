const moment = require('moment');
const { AuthUser } = require('../utils/helper');
const jwt=require('jsonwebtoken');
const userModel = require('../models/userModel');
const faqModel = require('../models/faqModel');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const settingController={
    faqCreate: async (req, res) => {
        const { title,description} = req.body;
        try {
            const faqInfo = await faqModel.create({ title,description});
            res.status(201).send({
                success: true,
                message: "FAQ Created Successfully",
                faqInfo
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: 'Error in creating country',
                error: error.message
            });
        }
    },
    faqGet: async (req, res) => {
        const faqInfo = await faqModel.find();
        res.status(201).send({
            success: true,
            faqInfo
        });
    }
}

module.exports={settingController}