const mongoose=require('mongoose')
// schema
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:[true,'user name is require']
    },
    email:{
        type:String,
        required:[true,'email  is require'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password  is require'],
        unique:true
    },
    usertype:{
        type:String,
        required:[true,'user type is required'],
        default:'client',
        enum:['client','admin','business-owner'],
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
        default:'free',
        enum:['free','premium','employer','premium'],
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
    slot_duration:{
        type:Number,
        default:0
    },
    status: {
        type: Number,
        default: 1, // Default value if not provided
        enum: [0, 1], // Example: Only allow values  1=active, or 0=inactive
    },
    is_delete: {
        type: Boolean,
        default: 0, // Default value is set to 0
    }
},{timestamps:true})

    module.exports=mongoose.model("User",userSchema)