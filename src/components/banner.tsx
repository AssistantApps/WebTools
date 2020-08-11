import React from 'react';

export const Banner = () => {
	return (
		<section className="home_banner_area">
			<div className="banner_inner d-flex align-items-center">
				<div className="overlay"></div>
				<div className="container">
					<div className="row">
						<div className="col-lg-8 offset-lg-4 col-xl-7 offset-xl-5">
							<div className="banner_content">
								<h3>Help make your favourite apps better!</h3>
								<p>Your feedback and help is appreciated! The Assistant Apps are only as good as they are now, thanks to the efforts of all the contributors, Patrons, donators and those who give feedback! 😁</p>
								<a className="banner_btn" href="#">Help translate<i className="ti-arrow-right"></i></a>
							</div>
						</div>

					</div>
				</div>
			</div>
		</section>
	);
}