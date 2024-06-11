const packageController=(req,res)=>{
    try{
        res.status(200).send(
            [
                {
                    'title':"free",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:0,verify_employers:0,review_job_applications:0,custom_questions:0},
                    "package_benefit": [
                        {
                            "details":"Access to basic app features",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"View business listings and events",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Ad-supported experience",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        }

                    ],
                },
                {
                    'title':"premium",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:4.99,verify_employers:4.99,review_job_applications:0,custom_questions:0,stripe_product:'price_1PDKejJ4eJxlN0V78W518dgE'},
                    "package_benefit": [
                        {
                            "details":"Full access to job listings and applications",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Ad-free experience",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Access to Compass+ features including AI supported personalized advice, resume and cover letter building",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        }

                    ],
                   
                },
                {
                    'title':"job_seeker",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:1.49,verify_employers:0,review_job_applications:0,custom_questions:0,stripe_product:'price_1PIkNPJ4eJxlN0V7xWTlJeDr'},
                    "package_benefit": [
                        {
                            "details":"Access to job listings and job application features",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Ad-supported experience",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"No Compass+ access",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        }
                    ]
                },
                {
                    'title':"premium_employer",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:9.99,verify_employers:0,review_job_applications:0,custom_questions:10,stripe_product:'price_1PDKhlJ4eJxlN0V7k9uhBLL5'},
                    "package_benefit": ["Full access to job listings and applications", "Ad-free experience", "Access to Compass+ features including AI supported personalized advice, resume and cover letter building"],
                    "package_benefit": [
                        {
                            "details":"Verified Blue Tick status",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Review job applications and CVs within the app",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Custom questions for job applicants",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"1 banner ad per month",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Ad-free experience",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        }
                    ]
                },
                {
                    'title':"general_employer",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:0,verify_employers:0,review_job_applications:0,custom_questions:0},
                    "package_benefit": [
                        {
                            "details":"Verified Blue Tick status",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Receive job applications on email",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"Ad-supported experience",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        }
                    ]
    
                },
          ]
        )
    }catch(error){
        console.error("Error in testUserController:", error);
        
    }
}
const productController=async(req,res)=>{
    try{

    res.status(201).send({
        success:true,
        message:"Login Successfully",
        user
    })
}catch(error){
    console.log(error)
    res.status(500).send({
       success:false,
       message:'error in productController api',
       error:error
    })
}

}

module.exports={packageController,productController}