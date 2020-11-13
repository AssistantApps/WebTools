import React from 'react';
import { Link } from 'react-router-dom';
import { ScreenshotSlider } from '../../../components/screenshotSlider/screenshotSlider';
import * as route from '../../../constants/route';

import './banner.scss';

export const Banner = () => {
	return (
		<section className="home_banner_area">
			<div className="banner_inner d-flex align-items-center">
				<div className="overlay"></div>
				<div className="container">
					<div className="row">
						<div className="col-lg-4 col-xl-5">
							<ScreenshotSlider />
						</div>
						<div className="col-lg-8 col-xl-7">
							<div className="banner_content">
								<h3>Help make your favourite apps better!</h3>
								<p style={{ fontSize: '1.5em' }}>Your feedback and help is appreciated! The Assistant Apps are only as good as they are now, thanks to the efforts of all the contributors, Patrons, donators and those who give feedback! <span role="img" aria-label="smiley">😁</span></p>
								<div className="row">
									<div className="col-12 col-lg-6">
										<Link className="banner_btn" to={route.translation}>Help translate<i className="ti-arrow-right"></i></Link>
									</div>
									{/* <div className="col-12 col-lg-6">
										<Link className="banner_btn" to={route.translation}>Create a Guide<i className="ti-arrow-right"></i></Link>
									</div> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

interface ISmallBannerProps {
	title: string;
	descrip: string;
}

export const SmallBanner = (props: ISmallBannerProps) => {
	return (
		<section className="home_banner_area small">
			<div className="banner_inner small d-flex align-items-center">
				<div className="overlay"></div>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="banner_content">
								<h3>{props.title}</h3>
								<p>{props.descrip}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}