import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { mapDispatchToProps, mapStateToProps } from './App.redux';
import { Footer } from './components/common/footer/footer';
import { Header } from './components/common/header/header';
import { ScrollToTop } from './components/common/scroll/scrollToTop';
import * as route from './constants/route';
import { HomePresenter } from './pages/home/homePresenter';
import { TranslationContainer } from './pages/translation/translationContainer';
import { StatisticsPresenter } from './pages/stats/statsPresenter';
import { GuideListPage } from './pages/guide/guideListPage';
import { CreateGuidePage } from './pages/guide/createGuidePage';
import { NotFoundPresenter } from './pages/notFoundPresenter';
import { StateSettingReducer } from './redux/state/StateSettingReducer';
import { Loading } from './components/common/loading';

interface IProps extends StateSettingReducer {
	location: any;
	isLoading: boolean;
	toggleMenu: () => void;
}

const AppUnconnected: React.FC<any> = (props: IProps) => {
	return (
		<>
			<Header />
			<ScrollToTop>
				<Switch>
					<Route exact={true} path={route.home} component={HomePresenter} />
					<Route path={route.translation} component={TranslationContainer} />
					<Route path={route.translationAlt} component={TranslationContainer} />
					<Route path={route.stats} component={StatisticsPresenter} />
					<Route path={route.guides} component={GuideListPage} />
					<Route path={route.createGuide} component={CreateGuidePage} />
					<Route path={route.editGuide} component={CreateGuidePage} />
					<Route component={NotFoundPresenter} />
				</Switch>
			</ScrollToTop>
			<Footer />
			{
				props.isLoading && <Loading />
			}
		</>
	);
}
export const App = connect(mapStateToProps, mapDispatchToProps)(withRouter(AppUnconnected));
