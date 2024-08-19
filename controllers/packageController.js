const packageController = (req, res) => {
    try {


        const info = new URL(req.url, `http://${req.headers.host}`);
        const searchParams = info.searchParams;
        const lang = searchParams.get("language");
        var result;


        
        if (lang == "tr") {
            result = [
                {

                    
                    'title': "free",
                    'name': "Temel",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 0, verify_employers: 0, review_job_applications: 0, custom_questions: 0 },
                    "package_benefit": [
                        {
                            "details": "Temel uygulama özelliklerine erişim",
                            "tooltip": "Kullanıcılar, Turk's Compass uygulamasında, isletmeleri kolayca bulabilir ve bu temel işlevlerini, işletmelerin ve hizmetlerin ana kategorilerine göz atma gibi, herhangi bir ücret ödemeden keşfedebilirler"
                        },
                        {
                            "details": "İşletme listelerini ve etkinlikleri görüntüleyin",
                            "tooltip": "Kullanıcılar, restoranlar, sağlık hizmeti sağlayıcıları ve diğer hizmetler dahil çeşitli işletme listelerini, ayrıca yaklaşan topluluk etkinliklerini ve promosyonları görebilirler."
                        },
                        {
                            "details": "Reklam destekli deneyim",
                            "tooltip": "Bu katman, uygulamanın temel özelliklerini kullanıcılar için ücretsiz tutmaya yardımcı olan, uygulama genelinde gösterilen reklamları içerir."
                        }

                    ],
                },
                {
                    'title': "job_seeker",
                    "name": "İş Arayan",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 1.99, verify_employers: 0, review_job_applications: 0, custom_questions: 0, stripe_product: 'price_1PpXdkFRINEpGtYyacHhjWWP' },
                    "package_benefit": [
                        {
                            "details": "İş listelerine ve iş başvurusu özelliklerine erişim",
                            "tooltip": "Kullanıcılar, uygulamada listelenen iş fırsatlarını görüntüleyebilir ve başvurabilir, bu da iş arayanlar için değerli bir kaynak sağlar."
                        },
                        {
                            "details": "Reklam destekli deneyim",
                            "tooltip": "Düşük aylık ücrete rağmen, bu katman yine de reklamları içerir."
                        },
                        {
                            "details": "Compass+ erişimi yok",
                            "tooltip": "Kullanıcılar, Al destekli kişiselleştirilmiş tavsiyeler veya özgeçmiş ve kapak mektubu oluşturma araçları gibi premium özelliklere erişemezler."
                        }
                    ]
                },
                
                {
                    'title': "premium",
                    "name": "Premium",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 4.99, verify_employers: 4.99, review_job_applications: 0, custom_questions: 0, stripe_product: 'price_1PpXd1FRINEpGtYyjefFS8xv' },
                    "package_benefit": [
                        {
                            "details": "İş listelerine ve başvurulara tam erişim",
                            "tooltip": "Kullanıcılar, iş arama yeteneklerini artıran tüm iş ilanlarına ve başvuru özelliklerine sınırsız erişimin keyfini çıkarır."
                        },
                        {
                            "details": "Reklamsız deneyim",
                            "tooltip": "Bu katman, reklamsız bir deneyim sunarak daha sorunsuz ve keyifli bir kullanıcı deneyimi sağlar."
                        },
                        {
                            "details": "Yapay zeka destekli kişiselleştirilmiş tavsiyeler, özgeçmiş ve ön yazı oluşturma dahil Compass+ özelliklerine erişim",
                            "tooltip": "Kullanıcılar, profesyonel özgeçmişler ve Kanada iş piyasası için hazırlanmış kapak mektupları oluşturma konusunda yardımcı olan Al destekli gelişmiş araçlar ve kişiselleştirilmiş tavsiyelerden yararlanır."
                        }

                    ],

                },
                {

                    'title': "general_employer",
                    "name": "Temel İşletme",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 0, verify_employers: 0, review_job_applications: 0, custom_questions: 0 },
                    "package_benefit": [
                        {
                            "details": "Temel uygulama özelliklerine erişim",
                            "tooltip": "İşverenler, Turk's Compass uygulamasının temel işlevlerini, işletmelerin ve hizmetlerin ana kategorilerine göz atma gibi, herhangi bir ücret ödemeden keşfedebilirler."
                        },
                        {
                            "details": "İşletme listelerini ve etkinlikleri görüntüleyin",
                            "tooltip": "İşverenler, restoranlar, sağlık hizmeti sağlayıcıları ve diğer hizmetler dahil çeşitli işletme listelerini, ayrıca yaklaşan topluluk etkinliklerini ve promosyonları görebilirler."
                        },
                        {
                            "details": "Reklam destekli deneyim",
                            "tooltip": "Bu katman, uygulamanın temel özelliklerini kullanıcılar için ücretsiz tutmaya yardımcı olan, uygulama genelinde gösterilen reklamları içerir."
                        },
                        {
                            "details": "“Premium İşveren” özelliği yok",
                            "tooltip": "Temel İşveren katmanı, Mavi Tik durum rozeti ve iş portalında iş başvurusunda bulunanlara özel sorular sorma yeteneği gibi premium özelliklerden yoksundur."
                        },
                    ]

                },
                {
                    'title': "premium_employer",
                    'name':"Premium İşletme",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 9.99, verify_employers: 0, review_job_applications: 0, custom_questions: 10, stripe_product: 'price_1PpXeTFRINEpGtYytfiI82O1' },
                    "package_benefit": ["Full access to job listings and applications", "Ad-free experience", "Access to Compass+ features including AI supported personalized advice, resume and cover letter building"],
                    "package_benefit": [
                        {
                            "details": "İş listelerine ve uygulamalara tam erişim",
                            "tooltip": "İşverenler, Turk's Compass uygulamasındaki tüm başvuru özelliklerine sınırsız erişimin keyfini çıkarır."
                        },
                        {
                            "details": "Doğrulanmış Mavi Tik durumu",
                            "tooltip": "İşverenler, Turk's Compass uygulamasının kullanıcılarının ve iş arayanların gözünde güvenilirliklerini ve güvenilirliklerini artıran bir doğrulama rozeti alır."
                        },
                        // {
                        //     "details":"Review job applications and CVs within the app",
                        //     "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        // },
                        {
                            "details": "İş başvurusunda bulunanlar için özel sorular",
                            "tooltip": "İşverenler, başvuranların yanıtlaması için özel sorular oluşturabilir, böylece en alakalı bilgileri alırlar."
                        },
                        // {
                        //     "details": "Ayda 1 banner reklam",
                        //     "tooltip": "İşverenler, ayda bir ücretsiz banner reklamı kazanırlar."
                        // },
                        {
                            "details": "Reklamsız deneyim",
                            "tooltip": "Bu katman, işverenler için reklamsız bir deneyim sağlar, böylece iş ilanlarını ve başvurularını yönetmeye odaklanabilirler."
                        }
                    ]
                }
            ]
        } else {
            result = [
                {
                    'title': "free",
                    'name': "Regular",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 0, verify_employers: 0, review_job_applications: 0, custom_questions: 0 },

                    "package_benefit": [
                        {
                            "details": "Access to basic app features",
                            "tooltip": "Users can explore essential functionalities of the Turk’s Compass app, such as browsing through the main categories of businesses and services without any cost."
                        },
                        {
                            "details": "View business listings and events",
                            "tooltip": "Users can see various business listings, including restaurants, healthcare providers, and other services, as well as upcoming community events and promotions"
                        },
                        {
                            "details": "Ad-supported experience",
                            "tooltip": "This tier includes advertisements displayed throughout the app, which helps keep the basic features free for users"
                        }

                    ],
                },
                {
                    'title': "job_seeker",
                    'name': "Job Seeker ",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 1.99, verify_employers: 0, review_job_applications: 0, custom_questions: 0, stripe_product: 'price_1PpXdkFRINEpGtYyacHhjWWP' },
                    "package_benefit": [
                        {
                            "details": "Access to job listings and job application features",
                            "tooltip": "Subscribers can view and apply for job opportunities listed in the app, providing a valuable resource for those seeking employment."
                        },
                        {
                            "details": "Ad-supported experience",
                            "tooltip": "Despite the low monthly fee, this tier still includes advertisements, ensuring the subscription remains affordable while generating revenue."
                        },
                        {
                            "details": "No Compass+ access",
                            "tooltip": "Users do not have access to premium features like AI-supported personalized advice or resume and cover letter building tools."
                        }
                    ]
                },
                {
                    'title': "premium",
                    'name': "Premium",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 4.99, verify_employers: 4.99, review_job_applications: 0, custom_questions: 0, stripe_product: 'price_1PpXd1FRINEpGtYyjefFS8xv' },
                    "package_benefit": [
                        {
                            "details": "Full access to job listings and applications",
                            "tooltip": "Subscribers enjoy unrestricted access to all job listings and application features, enhancing their job search capabilities."
                        },
                        {
                            "details": "Ad-free experience",
                            "tooltip": "This tier eliminates advertisements, providing a smoother and more enjoyable user experience."
                        },
                        {
                            "details": "Access to Compass+ features including AI supported personalized advice, resume and cover letter building",
                            "tooltip": "Subscribers benefit from advanced tools and personalized advice powered by AI, aiding in creating professional resumes and cover letters tailored for the Canadian job market."
                        }

                    ],

                },
                {
                    'title': "general_employer",
                    'name':"Regular Business ",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 0, verify_employers: 0, review_job_applications: 0, custom_questions: 0 },
                    "package_benefit": [
                        {
                            "details": "Access to basic app features",
                            "tooltip": "Employers can explore essential functionalities of the Turk’s Compass app, such as browsing through the main categories of businesses and services without any cost."
                        },
                        {
                            "details": "View business listings and events",
                            "tooltip": "Employers can see various business listings, including restaurants, healthcare providers, and other services, as well as upcoming community events and promotions."
                        },
                        {
                            "details": "Ad-supported experience",
                            "tooltip": "This tier includes advertisements displayed throughout the app, which helps keep the basic features free for users."
                        },
                        {
                            "details": "No “Premium Employer” features",
                            "tooltip": "The Basic Employer tier lacks premium features such as the Blue Tick status badge and the ability to ask custom questions to job applicants on the job portal."
                        },
                    ]

                },
                {
                    'title': "premium_employer",
                    'name':"Premium Business ",
                    'description': { job_seeker_access: 0, ads: 0, compass: 0, monthly_price: 9.99, verify_employers: 0, review_job_applications: 0, custom_questions: 10, stripe_product: 'price_1PpXeTFRINEpGtYytfiI82O1' },
                    "package_benefit": ["Full access to job listings and applications", "Ad-free experience", "Access to Compass+ features including AI supported personalized advice, resume and cover letter building"],
                    "package_benefit": [
                        {
                            "details": "Full access to job listings and applications",
                            "tooltip": "Employers enjoy unrestricted access to all application features in the Turk’s Compass app."
                        },
                        {
                            "details": "Verified Blue Tick status",
                            "tooltip": "Employers receive a verification badge, enhancing their credibility and trustworthiness in the eyes of the Turk’s Compass app's users and the job seekers."
                        },
                        // {
                        //     "details":"Review job applications and CVs within the app",
                        //     "tooltip":"In publishing and graphic design, Lorem ipsum is a placeholder text commonly"
                        // },
                        {
                            "details": "Custom questions for job applicants",
                            "tooltip": "Employers can create tailored questions for applicants to answer, ensuring they receive the most relevant information."
                        },
                        // {
                        //     "details": "1 banner ad per month",
                        //     "tooltip": "Employers are awarded one free banner ad per month to promote their business or job openings within the app."
                        // },
                        {
                            "details": "Ad-free experience",
                            "tooltip": "This tier provides an ad-free experience for employers, allowing them to focus solely on managing job postings and applications without distractions."
                        }
                    ]
                }
            ]
        }



        res.status(200).send(
            result
        )
    } catch (error) {
        console.error("Error in testUserController:", error);

    }
}
const productController = async (req, res) => {
    try {

        res.status(201).send({
            success: true,
            message: "Login Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'error in productController api',
            error: error
        })
    }

}

module.exports = { packageController, productController }
