const mongoose=require('mongoose')
// schema
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        default:null,
        // required:[true,'user name is require']
    },
    photo:{
        type:String,
    },
    cover_photo:{
        type:String,
    },
    email:{
        type:String,
        required:[true,'email  is require'],
        unique:true
    },
    password:{
        type:String,
        // required:[true,'password  is require'],
        // unique:true
    },
    language:{
        type:String,
        default:"en", // default language 2 language en--> English and tr --> Turkish
        enum:['en','tr'],
    },
    usertype:{
        type:String,
        required:[true,'user type is required'],
        default:'client',
        enum:['client','admin','business-owner'],
    },
    email_verification_code:{
        type:String,
        default:null,
    },
    forget_password_code_time:{
        type:String,
        default:null,
    },
    is_email_verified:{
        type: Number,
        default: 0, // Default value if not provided
        enum: [0, 1], // Example: Only allow values  1=active, or 0=inactive
    },
    reset_code:{
        type:String,
        default:null,
    },
    reset_code_time:{
        type:String,
        default:null,
    },
    package_type:{
        type:String,
        default:null,
        enum:['free','premium','job_seeker_free','premium_employer','job_seeker','general_employer',null],
    },
    job_seeker_free_start_date:{
        type:Date,
        default:null
    },
    package_start_date:{
        type:Date,
        default:null
    },
    package_end_date:{
        type:Date,
        default:null
    },
    package_duration:{
        type:String,
        default:null
    },
    is_reservation_available:{
        type:Boolean,
        default:0
    },
    is_multiple_reservation_available:{
        type:Boolean,
        default:0
    },  
    is_notification_on:{
        type:Boolean,
        default:1
    },
    device_token:{
        type: String,
        default:null
    },
    from_date_vacation:{
        type: String,
        default:null
    },
    to_date_vacation:{
        type: String,
        default:null
    },
    slot_duration:{
        type:Number,
        default:0
    },
    status: {
        type: Number,
        default: 1, // Default value if not provided
        enum: [0, 1], // Example: Only allow values  1=active, or 0=inactive
    },
    claimed_account: {
        type: Number,
        default: 0, // Default value if not provided
        enum: [0, 1], // Example: Only allow values  1=active, or 0=inactive
    },
    is_delete: {
        type: Boolean,
        default: 0, // Default value is set to 0
    },
    payment_method:{
        type:String,
        default:null
    },
    payment_trnx_number:{
        type:String,
        default:null
    },
},{timestamps:true})

    module.exports=mongoose.model("User",userSchema)