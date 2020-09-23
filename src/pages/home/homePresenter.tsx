import React from 'react';

import { Banner } from '../../components/common/banner/banner';
import { AsymmetricBoxes } from '../../components/section/asymmetricBoxes';
import { asymmetricBoxItems } from '../../constants/homePageConstants';

export const HomePresenter: React.FC = () => {
    return (
        <>
            <Banner />
            <AsymmetricBoxes items={asymmetricBoxItems} />
            <section className="about-area area-padding-bottom">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="area-heading">
                                <h4>Custom built tools<br />just for you. </h4>
                                <h6>These tools are created for you to have an impact on the apps</h6>
                                <p>These tools help people contribute to the development of the Assistant Apps and make the apps even better <span role="img">💪</span></p>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-lg-6">
                                    <div className="single-about">
                                        <div className="about-icon">
                                            <i className="ti-thought"></i>
                                        </div>
                                        <div className="single-about-content">
                                            <h5>Always online</h5>
                                            <p>All the data is stored on the server and allows for the apps to dynamically get the data they require whenever it is needed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <div className="single-about">
                                        <div className="about-icon">
                                            <i className="ti-support"></i>
                                        </div>
                                        <div className="single-about-content">
                                            <h5>Easy to use</h5>
                                            <p>Designed to be easy to use, friendly UI / UX. Quick responses to support requests</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="feature-area area-padding bg_one">
                <div className="container">
                    <div className="row align-items-center">

                        <div className="offset-lg-6 col-lg-6">
                            <div className="area-heading light">
                                <h4>Enhance through<br />dynamic data</h4>
                                <p>By keeping the data on the server and making the apps request the data when needed, we are able to be more agile and react to events a lot quicker than if the data was stored in the app. The App Stores can take anywhere from 12 to 192 hours for an update to be approved. </p>
                            </div>
                            <div className="row">
                                <div className="col-">
                                    <div className="single-feature d-flex">
                                        <div className="feature-icon">
                                            <i className="ti-comments-smiley"></i>
                                        </div>
                                        <div className="single-feature-content">
                                            <h5>Language suport</h5>
                                            <p>The AssistantApps are built with localization in mind from the beginning of their development. We want to be as inclusive as possible and realise that there are many many more languages other than English out there</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-">
                                    <div className="single-feature d-flex">
                                        <div className="feature-icon">
                                            <i className="ti-book"></i>
                                        </div>
                                        <div className="single-feature-content">
                                            <h5>Guides</h5>
                                            <p>We enjoy helping players help each other. We understand that we can always learn more, whether that is in terms of a specific game, app development, marketing etc. And so the Guide system is made to help those who know a lot, pass on their knowledge to others</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="statics-area area-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="image-box">
                                <img src="/assets/img/banner/about3.png" alt="" />
                            </div>
                        </div>
                        <div className="offset-lg-1 col-lg-6">
                            <div className="area-heading">
                                <h4>Learning from<br />Feedback and Analytics</h4>
                                <h6>We are constantly listening to feedback and keeping an eye on the analytics</h6>

                                <p>We want to ensure that the apps are the best that they could be and so we are constantly looking for places to improve. Direct feedback from users is the most important tool at our dispossal</p>
                            </div>
                            <div className="single-data">
                                <h6>Important factors for our users</h6>
                            </div>
                            <div className="single-data">
                                <i className="ti-paint-bucket"></i>
                                <p>Customizability</p>
                            </div>
                            <div className="single-data">
                                <i className="ti-ruler-pencil"></i>
                                <p>Accuracy</p>
                            </div>
                            <div className="single-data">
                                <i className="ti-check-box"></i>
                                <p>Feature rich</p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
            {/* 
            <section className="latest-blog-area area-padding">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-12">
                            <div className="area-heading">
                                <h4>Read Our Latest News</h4>
                                <p>Life firmament under them evening make after called dont saying likeness<br /> isn't wherein also forth she'd air two without</p>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8 col-md-6 ">
                            <div className="single-blog full_image">
                                <div className="thumb">
                                    <img className="img-fluid w-100" src="/assets/img/blog/1.png" alt="" />
                                </div>
                                <div className="single-blog-content">
                                    <p className="tag">Software / Business</p>
                                    <p className="date">March 10, 2019</p>
                                    <h4>
                                        <a href="#">Appear called is blessed good void had given from <br />
                              which Lights Saying image.</a>
                                    </h4>
                                    <div className="meta-bottom d-flex">
                                        <p className="likes"><i className="ti-comments"></i> 02 Comments</p>
                                        <p><i className="ti-heart"></i> 15 </p>
                                    </div>

                                </div>

                            </div>

                        </div>


                        <div className="col-lg-4 col-md-6 ">
                            <div className="single-blog">
                                <div className="thumb">
                                    <img className="img-fluid w-100" src="/assets/img/blog/2.png" alt="" />
                                </div>
                                <div className="single-blog-content">
                                    <p className="tag">Software / Business</p>
                                    <p className="date">March 10, 2019</p>
                                    <h4>
                                        <a href="#">You living thing whose After
                            our third you also Us.</a>
                                    </h4>
                                    <div className="meta-bottom d-flex">
                                        <p className="likes"><i className="ti-comments"></i> 02 Comments</p>
                                        <p><i className="ti-heart"></i> 15 </p>
                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className="col-lg-4 col-md-6 ">
                            <div className="single-blog">
                                <div className="thumb">
                                    <img className="img-fluid w-100" src="/assets/img/blog/1.png" alt="" />
                                </div>
                                <div className="single-blog-content">
                                    <p className="tag">Software / Business</p>
                                    <p className="date">March 10, 2019</p>
                                    <h4>
                                        <a href="#">You living thing whose After
                            our third you also Us.</a>
                                    </h4>
                                    <div className="meta-bottom d-flex">
                                        <p className="likes"><i className="ti-comments"></i> 02 Comments</p>
                                        <p><i className="ti-heart"></i> 15 </p>
                                    </div>

                                </div>
                            </div>

                        </div>


                        <div className="col-lg-8 col-md-6">
                            <div className="single-blog full_image">
                                <div className="thumb">
                                    <img className="img-fluid w-100" src="/assets/img/blog/4.png" alt="" />
                                </div>
                                <div className="single-blog-content">
                                    <p className="tag">Software / Business</p>
                                    <p className="date">March 10, 2019</p>
                                    <h4>
                                        <a href="#">You living thing whose After
                            our third you also Us.</a>
                                    </h4>
                                    <div className="meta-bottom d-flex">
                                        <p className="likes"><i className="ti-comments"></i> 02 Comments</p>
                                        <p><i className="ti-heart"></i>15</p>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </section> */}

            <section className="brands-area area-padding-bottom">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            <div className="owl-carousel brand-carousel">
                                <div className="single-brand-item d-table">
                                    <div className="d-table-cell">
                                        <img src="/assets/img/logo/1.png" alt="" />
                                    </div>
                                </div>
                                <div className="single-brand-item d-table">
                                    <div className="d-table-cell">
                                        <img src="/assets/img/logo/2.png" alt="" />
                                    </div>
                                </div>
                                <div className="single-brand-item d-table">
                                    <div className="d-table-cell">
                                        <img src="/assets/img/logo/3.png" alt="" />
                                    </div>
                                </div>
                                <div className="single-brand-item d-table">
                                    <div className="d-table-cell">
                                        <img src="/assets/img/logo/4.png" alt="" />
                                    </div>
                                </div>
                                <div className="single-brand-item d-table">
                                    <div className="d-table-cell">
                                        <img src="/assets/img/logo/5.png" alt="" />
                                    </div>
                                </div>
                                <div className="single-brand-item d-table">
                                    <div className="d-table-cell">
                                        <img src="/assets/img/logo/3.png" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
