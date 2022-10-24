import React, { useState } from 'react';
import { Link } from 'wouter';
import classNames from 'classnames';

import { LoginDialog } from '../../dialog/loginDialog';

import './header.scss';
import { Icon } from 'semantic-ui-react';
import { home, stats, translation } from '../../../constants/route';

interface IState {
	isOpen: boolean;
	links: Array<any>;
}

interface IProps { }

export const Header: React.FC<IProps> = (props: IProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const links = [
		{ route: home, iconName: 'home', text: 'Home' },
		{ route: translation, iconName: 'conversation', text: 'Translate' },
		{ route: stats, iconName: 'line graph', text: 'Stats' },
		// { route: '/stats', iconName: 'wpforms', text: 'Contact' },
	];

	const onMenuClick = (e: any) => {
		e?.preventDefault?.();

		const event = new Event('hashchange');
		window.dispatchEvent(event);
	}

	const toggleOpen = () => setIsOpen((prev) => !prev);

	return (
		<header className="header_area navbar_fixed">
			<div className="main_menu">
				<nav className="navbar navbar-expand-lg navbar-light noselect">
					<div className="container">
						<a className="navbar-brand logo_h" href="/">
							<img src="/assets/img/logo-sm.png" alt="logo" style={{ height: '100%' }} />
							<h2 className="heading col-md-0" style={{ display: 'inline', paddingLeft: '1em' }}>AssistantApp Tools</h2>
						</a>
						<button className="navbar-toggler"
							type="button"
							aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
							data-toggle="collapse" data-target="#navbarSupportedContent"
							onClick={toggleOpen}>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<div className={classNames('collapse navbar-collapse offset', { 'show': isOpen })}
							id="navbarSupportedContent" >
							<ul className="nav navbar-nav menu_nav ml-auto">
								{
									links.map((item: any) => {
										return (
											<li key={`${item.text}-${item.route}`} className="nav-item">
												<Link className="nav-link" to={'/#' + item.route} onClick={onMenuClick}>
													<Icon
														inverted
														name={item.iconName}
														color={"grey"}
														size="large"
														className="pointer"
													/>
													{item.text}
												</Link>
											</li>
										)
									})
								}
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