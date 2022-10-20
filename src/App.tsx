import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Route, Router } from "wouter";
import { mapDispatchToProps, mapStateToProps } from './App.redux';
import { Footer } from './components/common/footer/footer';
import { Header } from './components/common/header/header';
import * as route from './constants/route';
import { HomePresenter } from './pages/home/homePresenter';
import { TranslationContainer } from './pages/translation/translationContainer';
import { StatisticsPresenter } from './pages/stats/statsPresenter';
import { GuideListPage } from './pages/guide/guideListPage';
import { CreateGuidePage } from './pages/guide/createGuidePage';
import { NotFoundPresenter } from './pages/notFoundPresenter';
import { StateSettingReducer } from './redux/state/StateSettingReducer';
import { Loading } from './components/common/loading';

const currentLocation = () =>
	window.location.hash.replace(/^#/, "") || "/";

const navigate = (to: any) => (window.location.hash = to);

const useHashLocation: any = () => {
	const [loc, setLoc] = useState(currentLocation());

	useEffect(() => {
		// this function is called whenever the hash changes
		const handler = () => {
			setLoc(currentLocation());
			// window.scrollTo(0, 0);
		};

		// subscribe to hash changes
		window.addEventListener("hashchange", handler);
		return () => window.removeEventListener("hashchange", handler);
	}, []);

	return [loc, navigate];
};

interface IProps extends StateSettingReducer {
	isLoading: boolean;
	toggleMenu: () => void;
}

const AppUnconnected: React.FC<any> = (props: IProps) => {
	return (
		<>
			<Header />
			<Router hook={useHashLocation}>
				<Route path="/" component={HomePresenter} />
				<Route path={route.translation} component={TranslationContainer} />
				<Route path={route.translationAlt} component={TranslationContainer} />
				<Route path={route.stats} component={StatisticsPresenter} />
				<Route path={route.guides} component={GuideListPage} />
				<Route path={route.createGuide} component={CreateGuidePage} />
				<Route path={route.editGuide} component={CreateGuidePage} />
				<Route component={NotFoundPresenter} />
			</Router>
			<Footer />
			{
				props.isLoading && <Loading />
			}
		</>
	);
}
export const App = connect(mapStateToProps, mapDispatchToProps)(AppUnconnected);
