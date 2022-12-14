import React from 'react';

import packageJson from '../../../../package.json';
import { ExternalUrls } from '../../../constants/externalUrls';

export const Footer = () => {
    return (
        <footer className="footer-area">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-sm-6 mb-4 mb-xl-0 single-footer-widget">
                        <h4>About Us</h4>
                        <p>AssistantApps creates beautiful and fast cross-platform apps built to help you in your favourite games!</p>
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
                        <h4>News</h4>
                        <p>Join the <a href={ExternalUrls.patreon} target="_blank" rel="noopener noreferrer">Patreon page</a> to get early access and a behind-the-scenes look at we are building.</p>
                    </div>

                    <div className="col-lg-4 col-sm-6 mb-4 mb-xl-0 single-footer-widget">
                        <div className="footer-logo">
                            <img src="/assets/img/logo-sm.png" alt="" />
                        </div>
                    </div>
                </div>
                <div className="footer-bottom row align-items-center text-center text-lg-left no-gutters">
                    <p className="footer-text m-0 col-lg-8 col-md-12">
                        Copyright &copy;{new Date().getFullYear()} All rights reserved | <a href={ExternalUrls.kurtlourens} target="_blank" rel="noopener noreferrer">Kurt Lourens</a> | {packageJson.version}
                    </p>
                    <div className="col-lg-4 col-md-12 text-center text-lg-right footer-social">
                        <a href={ExternalUrls.kurtlourensFacebook} target="_blank" rel="noopener noreferrer"><i className="ti-facebook"></i></a>
                        <a href={ExternalUrls.kurtlourensTwitter} target="_blank" rel="noopener noreferrer"><i className="ti-twitter-alt"></i></a>
                        <a href={ExternalUrls.kurtlourens} target="_blank" rel="noopener noreferrer"><i className="ti-html5"></i></a>
                        <a href={ExternalUrls.kurtlourensLinkedIn} target="_blank" rel="noopener noreferrer"><i className="ti-linkedin"></i></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}