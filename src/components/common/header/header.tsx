import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { LoginDialog } from '../../dialog/loginDialog';

import './header.scss';
import { Icon } from 'semantic-ui-react';

interface IState {
	isOpen: boolean;
	links: Array<any>;
}

interface IProps { }

export class Header extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);

		this.state = {
			isOpen: false,
			links: [
				{ route: '/', iconName: 'home', text: 'Home' },
				{ route: '/translation', iconName: 'conversation', text: 'Translate' },
				{ route: '/stats', iconName: 'line graph', text: 'Stats' },
				// { route: '/stats', iconName: 'wpforms', text: 'Contact' },
			]
		};
	}

	toggleOpen = () => {
		this.setState((prevState: IState) => {
			return {
				isOpen: !prevState.isOpen,
			}
		});
	}

	render() {
		return (
			<header className="header_area navbar_fixed">
				<div className="main_menu">
					<nav className="navbar navbar-expand-lg navbar-light">
						<div className="container">
							<a className="navbar-brand logo_h" href="/">
								<img src="/assets/img/logo-sm.png" alt="logo" style={{ height: '100%' }} />
								<h2 className="heading col-md-0" style={{ display: 'inline', paddingLeft: '1em' }}>AssistantApp Tools</h2>
							</a>
							<button className="navbar-toggler"
								type="button"
								aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"
								data-toggle="collapse" data-target="#navbarSupportedContent"
								onClick={this.toggleOpen}>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							<div className={classNames('collapse navbar-collapse offset', { 'show': this.state.isOpen })}
								id="navbarSupportedContent" >
								<ul className="nav navbar-nav menu_nav ml-auto">
									{
										this.state.links.map((item: any) => {
											return (
												<li key={`${item.text}-${item.route}`} className="nav-item">
													<Link className="nav-link" to={item.route} onClick={this.toggleOpen}>
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
}