import React from 'react';
import { LoginDialog } from '../../dialog/loginDialog';

import './header.scss';

export const Header = () => {
	return (
		<header className="header_area navbar_fixed">
			<div className="main_menu">
				<nav className="navbar navbar-expand-lg navbar-light">
					<div className="container">
						<a className="navbar-brand logo_h" href="/">
							<img src="/assets/img/logo-sm.png" alt="logo" style={{ height: '100%' }} />
							<h2 className="heading" style={{ display: 'inline', paddingLeft: '1em' }}>AssistantApp Tools</h2>
						</a>
						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<div className="collapse navbar-collapse offset" id="navbarSupportedContent">
							<ul className="nav navbar-nav menu_nav ml-auto">
								<li className="nav-item">
									<a className="nav-link" href="index.html">Home</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="contact.html">Contact</a>
								</li>
								<li className="nav-item">
									<LoginDialog />
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
}