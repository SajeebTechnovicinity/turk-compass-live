const jobModel = require("../models/jobModel");
const { AuthUser } = require("../utils/helper");

const jobController={

    create:async(req,res)=>{

        const {description,skill,requirement,benifit,question}=req.body;

        const user_info= await AuthUser(req);
        const user_id=user_info.id;
        const jobInfo= await jobModel.create({user_id,description,skill,requirement,benifit,question});
    
        try{
        res.status(201).send({
            success:true,
            message:"Login Successfully",
            jobInfo
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
           success:false,
           message:'error in jobController api',
           error:error
        })
    }
    },

    apply:async(req,res)=>{
        const user_info= await AuthUser(req);
        const user_id=user_info.id;
        const {job_id,cv,cover_letter}=req.body;

        const base64Data = cv; // Get the base64 data from the request body
        // Decode the base64 data
        const decodedData = Buffer.from(base64Data, 'base64');
    
        // Specify the file path and name where the file will be saved
        const filePath = path.join(__dirname, 'uploads', 'uploaded-file.jpg'); // Change the file extension as needed
    
        // Write the decoded data to the file
        fs.writeFile(filePath, decodedData, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Failed to upload file.');
            }
            res.send('File uploaded successfully.');
        });





        // jobApplyModel.create({job_id,cv,cover_letter})

    }



}

module.exports={jobController}