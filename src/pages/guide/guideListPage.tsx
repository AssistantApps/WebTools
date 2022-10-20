import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'wouter';
import { SmallBanner } from '../../components/common/banner/banner';
import { Error } from '../../components/common/error';
import { Loading, SmallLoading } from '../../components/common/loading';
import { LoginRequired } from '../../components/common/loginRequired';
import { CreateUserGuideTile, UserGuideTile } from '../../components/guide/userGuideTile';
import { NetworkState } from '../../constants/networkState';
import { createGuide, editGuide, editGuideParam } from '../../constants/route';
import { GuideSearchResultViewModel } from '../../contracts/generated/ViewModel/Guide/guideSearchResultViewModel';
import { PaginationWithValue } from '../../contracts/pagination/paginationWithValue';
import { anyObject } from '../../helper/typescriptHacks';
import { DependencyInjectionContext } from '../../integration/dependencyInjection';
import { mapStateToProps } from './guidListPage.Redux';

interface IFromRedux {
    userGuid: string;
}

interface IProps extends IFromRedux { }

export const GuideListPageUnconnected: React.FC<IProps> = (props: IProps) => {
    const [, setLocation] = useLocation();
    const services = useContext(DependencyInjectionContext);
    const [fetchStatus, setFetchStatus] = useState<NetworkState>(NetworkState.Pending);
    const [guidePagination, setGuidePagination] = useState<PaginationWithValue<Array<GuideSearchResultViewModel>>>(anyObject);

    useEffect(() => {
        const isNotLoggedIn = props.userGuid == null || props.userGuid.length < 1;
        if (isNotLoggedIn) return;
        fetchUserGuides();
        // eslint-disable-next-line
    }, [props.userGuid])

    const fetchUserGuides = async () => {
        const searchParams: any = {
            page: 1,
        }
        const guidesResult = await services.assistantAppsApiService.getGuidesForUser(searchParams);
        if (guidesResult.isSuccess === false) {
            setFetchStatus(NetworkState.Error);
            return;
        }
        setGuidePagination(guidesResult.value);
        setFetchStatus(NetworkState.Success);
    }

    const banner = (
        <SmallBanner
            title="Guides"
            descrip="Tool for creating and editing Guides for the the Assistant Apps"
        />
    );
    const isNotLoggedIn = props.userGuid == null || props.userGuid.length < 1;
    if (isNotLoggedIn) {
        return (
            <>
                {banner}
                <div className="container">
                    <div className="row full pt3 pb3">
                        <LoginRequired />
                    </div>
                </div>
            </>
        );
    }

    const renderPageContent = () => {
        if (fetchStatus === NetworkState.Error) return <Error message="Something went wrong" />;
        if (fetchStatus === NetworkState.Loading) return <SmallLoading />;

        return (
            <>
                {
                    (guidePagination?.value ?? []).map((guide: GuideSearchResultViewModel) => (
                        <UserGuideTile
                            key={guide.guid}
                            item={{ ...guide }}
                            onDeleteClick={async () => {
                                setFetchStatus(NetworkState.Loading);
                                await services.assistantAppsApiService.deleteGuide(guide.guid);
                                fetchUserGuides();
                            }}
                            onClick={() => {
                                setLocation(
                                    editGuide.replace(editGuideParam, guide.guid)
                                );
                            }}
                        />
                    ))
                }
                <CreateUserGuideTile onClick={() => setLocation(createGuide)} />
            </>
        );
    }

    return (
        <div className="guide-page">
            {banner}
            <div className="container">
                <div className="row full pt3 pb3">
                    {renderPageContent()}
                </div>
            </div>
            {
                (fetchStatus === NetworkState.Loading) && <Loading />
            }
        </div>
    );
};

export const GuideListPage: any = connect(mapStateToProps)(GuideListPageUnconnected);
