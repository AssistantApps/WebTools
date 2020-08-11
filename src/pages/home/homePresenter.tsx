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
                                <h4>Form Female From<br />Cattle Evening. </h4>
                                <h6>And appear great open bearing evening dominion vodi </h6>

                                <p>There earth face earth behold. She'd stars made void two given do and also. Our own grass days.  Greater male Shall There faced earth behold She star</p>
                            </div>
                            <div className="row">
                                <div className="col-md-6 col-lg-6">
                                    <div className="single-about">
                                        <div className="about-icon">
                                            <i className="ti-thought"></i>
                                        </div>
                                        <div className="single-about-content">
                                            <h5>Cloud Compatibility</h5>
                                            <p>There earth face earth behold. She stars made void two given and also our own grass days. Greater </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <div className="single-about">
                                        <div className="about-icon">
                                            <i className="ti-truck"></i>
                                        </div>
                                        <div className="single-about-content">
                                            <h5>On Time Delivery</h5>
                                            <p>There earth face earth behold. She stars made void two given and also our own grass days. Greater </p>
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
                                <h4>Easy to Use <br />Mobile Application</h4>
                                <p>There earth face earth behold. She'd stars made void two given do and also. Our own grass days.  Greater male Shall There faced earth behold She star</p>
                            </div>
                            <div className="row">
                                <div className="col-">
                                    <div className="single-feature d-flex">
                                        <div className="feature-icon">
                                            <i className="ti-layers"></i>
                                        </div>
                                        <div className="single-feature-content">
                                            <h5>Add New Project</h5>
                                            <p>There earth face earth behold. She stars made void two given and also our own grass days. Greater </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-">
                                    <div className="single-feature d-flex">
                                        <div className="feature-icon">
                                            <i className="ti-layers"></i>
                                        </div>
                                        <div className="single-feature-content">
                                            <h5>Generating Leads</h5>
                                            <p>There earth face earth behold. She stars made void two given and also our own grass days. Greater </p>
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
                                <h4>Form Female From<br />Cattle Evening. </h4>
                                <h6>And appear great open bearing evening dominion vodi </h6>

                                <p>There earth face earth behold. She'd stars made void two given do and also. Our own grass days.  Greater male Shall There faced earth behold She star</p>
                            </div>
                            <div className="single-data">
                                <i className="ti-paint-bucket"></i>
                                <p>Set dry signs spirit a kind First shall them.</p>
                            </div>
                            <div className="single-data">
                                <i className="ti-check-box"></i>
                                <p>He two face one moved dominion man you're likeness</p>
                            </div>
                            <div className="single-data">
                                <i className="ti-ruler-pencil"></i>
                                <p>Sea forth fill have divide be dominion from life</p>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <section className="pricing_area area-padding-top">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="area-heading">
                                <h4>Our Pricing Plan</h4>
                                <p>Life firmament under them evening make after called dont saying likeness<br /> isn't wherein also forth she'd air two without</p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <div className="single-pricing">
                                <div className="pricing-icon">
                                    <i className="ti-home"></i>
                                </div>
                                <div className="single-pricing-content">
                                    <h5>Standard</h5>
                                    <h4>$25<span className="currency_line">/</span><span>month</span></h4>
                                    <ul>
                                        <li>2GB Bandwidth</li>
                                        <li>Two Account</li>
                                        <li>15GB Storage</li>
                                        <li>Sale After Service</li>
                                        <li>3 Host Domain</li>
                                        <li>24/7 Support</li>
                                    </ul>
                                    <a href="#">Purchase Now</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="single-pricing">
                                <div className="pricing-icon">
                                    <i className="ti-bag"></i>
                                </div>
                                <div className="single-pricing-content">
                                    <h5>Business</h5>
                                    <h4>$35<span className="currency_line">/</span><span>month</span></h4>
                                    <ul>
                                        <li>2GB Bandwidth</li>
                                        <li>Two Account</li>
                                        <li>15GB Storage</li>
                                        <li>Sale After Service</li>
                                        <li>3 Host Domain</li>
                                        <li>24/7 Support</li>
                                    </ul>
                                    <a href="#">Purchase Now</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="single-pricing">
                                <div className="pricing-icon">
                                    <i className="ti-car"></i>
                                </div>
                                <div className="single-pricing-content">
                                    <h5>Premium</h5>
                                    <h4>$45<span className="currency_line">/</span><span>month</span></h4>
                                    <ul>
                                        <li>2GB Bandwidth</li>
                                        <li>Two Account</li>
                                        <li>15GB Storage</li>
                                        <li>Sale After Service</li>
                                        <li>3 Host Domain</li>
                                        <li>24/7 Support</li>
                                    </ul>
                                    <a href="#">Purchase Now</a>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="single-pricing">
                                <div className="pricing-icon">
                                    <i className="ti-gift"></i>
                                </div>
                                <div className="single-pricing-content">
                                    <h5>Ultimate</h5>
                                    <h4>$55<span className="currency_line">/</span><span>month</span></h4>
                                    <ul>
                                        <li>2GB Bandwidth</li>
                                        <li>Two Account</li>
                                        <li>15GB Storage</li>
                                        <li>Sale After Service</li>
                                        <li>3 Host Domain</li>
                                        <li>24/7 Support</li>
                                    </ul>
                                    <a href="#">Purchase Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
            </section>

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
