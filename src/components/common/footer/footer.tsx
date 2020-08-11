import React from 'react';
import { ExternalUrls } from '../../../constants/externalUrls';

// import './header.scss';

export const Footer = () => {
    return (
        <footer className="footer-area">
            <div className="container">
                <div className="row">

                    <div className="col-lg-4 col-sm-6 mb-4 mb-xl-0 single-footer-widget">
                        <h4>About Us</h4>
                        <p>AssistantApps creates Beautiful and fast cross-platform apps built to help you in your favourite games!</p>
                        <div className="footer-logo">
                            <img src="/assets/img/logo.png" alt="" />
                        </div>
                    </div>

                    <div className="col-lg-4 col-sm-6 mb-4 mb-xl-0 single-footer-widget">
                        <h4>Important Links</h4>
                        <ul>
                            <li><a href={ExternalUrls.assistantApps} target="_blank" rel="noopener noreferrer">Main website</a></li>
                            <li><a href={ExternalUrls.assistantAppsApi} target="_blank" rel="noopener noreferrer">API Docmunetation</a></li>
                            <li><a href={ExternalUrls.kurtlourensEmail} target="_blank" rel="noopener noreferrer">Contact Email</a></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-8 mb-4 mb-xl-0 single-footer-widget">
                        <h4>Newsletter</h4>
                        <p>Join the <a href={ExternalUrls.patreon} target="_blank" rel="noopener noreferrer">Patreon page</a> to get early access and a behind-the-scenes look at we are building. <br /> Or signup to our newsletter here:</p>

                        <div className="form-wrap" id="mc_embed_signup">
                            <form target="_blank" action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
                                method="get">
                                <div className="input-group">
                                    <input type="email" className="form-control" name="EMAIL" placeholder="Your Email Address" />
                                    <div className="input-group-append">
                                        <button className="btn click-btn" type="submit">
                                            <i className="fab fa-telegram-plane"></i>
                                        </button>
                                    </div>
                                </div>
                                <div style={{ position: 'absolute', left: '-5000px' }}>
                                    <input name="b_36c4fd991d266f23781ded980_aefe40901a" value="" type="text" />
                                </div>

                                <div className="info"></div>
                            </form>
                        </div>

                    </div>
                </div>
                <div className="footer-bottom row align-items-center text-center text-lg-left no-gutters">
                    <p className="footer-text m-0 col-lg-8 col-md-12">
                        Copyright &copy;{new Date().getFullYear()} All rights reserved | <a href={ExternalUrls.kurtlourens} target="_blank" rel="noopener noreferrer">Kurt Lourens</a>
                    </p>
                    <div className="col-lg-4 col-md-12 text-center text-lg-right footer-social">
                        <a href="#"><i className="ti-facebook"></i></a>
                        <a href="#"><i className="ti-twitter-alt"></i></a>
                        <a href="#"><i className="ti-dribbble"></i></a>
                        <a href="#"><i className="ti-linkedin"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}