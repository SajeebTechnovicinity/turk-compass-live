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
                            "tooltip":"Users can explore essential functionalities of the Turk’s Compass app, such as browsing through the main categories of businesses and services without any cost."
                        },
                        {
                            "details":"View business listings and events",
                            "tooltip":"Users can see various business listings, including restaurants, healthcare providers, and other services, as well as upcoming community events and promotions"
                        },
                        {
                            "details":"Ad-supported experience",
                            "tooltip":"This tier includes advertisements displayed throughout the app, which helps keep the basic features free for users"
                        }

                    ],
                },
                {
                    'title':"premium",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:4.99,verify_employers:4.99,review_job_applications:0,custom_questions:0,stripe_product:'price_1PDKejJ4eJxlN0V78W518dgE'},
                    "package_benefit": [
                        {
                            "details":"Full access to job listings and applications",
                            "tooltip":"Subscribers enjoy unrestricted access to all job listings and application features, enhancing their job search capabilities."
                        },
                        {
                            "details":"Ad-free experience",
                            "tooltip":"This tier eliminates advertisements, providing a smoother and more enjoyable user experience."
                        },
                        {
                            "details":"Access to Compass+ features including AI supported personalized advice, resume and cover letter building",
                            "tooltip":"Subscribers benefit from advanced tools and personalized advice powered by AI, aiding in creating professional resumes and cover letters tailored for the Canadian job market."
                        }

                    ],
                   
                },
                {
                    'title':"job_seeker",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:1.99,verify_employers:0,review_job_applications:0,custom_questions:0,stripe_product:'price_1PIkNPJ4eJxlN0V7xWTlJeDr'},
                    "package_benefit": [
                        {
                            "details":"Access to job listings and job application features",
                            "tooltip":"Subscribers can view and apply for job opportunities listed in the app, providing a valuable resource for those seeking employment."
                        },
                        {
                            "details":"Ad-supported experience",
                            "tooltip":"Despite the low monthly fee, this tier still includes advertisements, ensuring the subscription remains affordable while generating revenue."
                        },
                        {
                            "details":"No Compass+ access",
                            "tooltip":"Users do not have access to premium features like AI-supported personalized advice or resume and cover letter building tools."
                        }
                    ]
                },
                {
                    'title':"premium_employer",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:9.99,verify_employers:0,review_job_applications:0,custom_questions:10,stripe_product:'price_1PDKhlJ4eJxlN0V7k9uhBLL5'},
                    "package_benefit": ["Full access to job listings and applications", "Ad-free experience", "Access to Compass+ features including AI supported personalized advice, resume and cover letter building"],
                    "package_benefit": [
                        {
                            "details":"Full access to job listings and applications",
                            "tooltip":"Employers enjoy unrestricted access to all application features in the Turk’s Compass app."
                        },
                        {
                            "details":"Verified Blue Tick status",
                            "tooltip":"Employers enjoy unrestricted access to all application features in the Turk’s Compass app."
                        },
                        // {
                        //     "details":"Review job applications and CVs within the app",
                        //     "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        // },
                        {
                            "details":"Custom questions for job applicants",
                            "tooltip":"Employers can create tailored questions for applicants to answer, ensuring they receive the most relevant information."
                        },
                        {
                            "details":"1 banner ad per month",
                            "tooltip":"Employers are awarded one free banner ad per month to promote their business or job openings within the app."
                        },
                        {
                            "details":"Ad-free experience",
                            "tooltip":"This tier provides an ad-free experience for employers, allowing them to focus solely on managing job postings and applications without distractions."
                        }
                    ]
                },
                {
                    'title':"general_employer",
                    'description':{job_seeker_access:0,ads:0,compass:0,monthly_price:0,verify_employers:0,review_job_applications:0,custom_questions:0},
                    "package_benefit": [
                        {
                            "details":"Access to basic app features",
                            "tooltip":"Employers can explore essential functionalities of the Turk’s Compass app, such as browsing through the main categories of businesses and services without any cost."
                        },
                        {
                            "details":"View business listings and events",
                            "tooltip":"Employers can see various business listings, including restaurants, healthcare providers, and other services, as well as upcoming community events and promotions."
                        },         
                        {
                            "details":"Ad-supported experience",
                            "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        },
                        {
                            "details":"No “Premium Employer” features",
                            "tooltip":"The Basic Employer tier lacks premium features such as the Blue Tick status badge and the ability to ask custom questions to job applicants on the job portal."
                        },
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