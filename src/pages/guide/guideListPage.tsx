import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { SmallBanner } from '../../components/common/banner/banner';
import { Error } from '../../components/common/error';
import { Loading } from '../../components/common/loading';
import { LoginRequired } from '../../components/common/loginRequired';
import { CreateUserGuideTile, UserGuideTile } from '../../components/guide/userGuideTile';
import { NetworkState } from '../../constants/networkState';
import { createGuide, editGuide, editGuideParam } from '../../constants/route';
import { GuideSearchResultViewModel } from '../../contracts/generated/ViewModel/Guide/guideSearchResultViewModel';
import { PaginationWithValue } from '../../contracts/pagination/paginationWithValue';
import { anyObject } from '../../helper/typescriptHacks';
import { IDependencyInjection, withServices } from '../../integration/dependencyInjection';
import { AssistantAppsApiService } from '../../services/api/AssistantAppsApiService';
import { mapStateToProps } from './guidListPage.Redux';

interface IWithDepInj {
    assistantAppsApiService: AssistantAppsApiService;
}
interface IWithoutDepInj {
    location: any;
    match: any;
    history: any;
}
interface IFromRedux {
    userGuid: string;
}

interface IProps extends IFromRedux, IWithDepInj, IWithoutDepInj { }

export const GuideListPageUnconnected: React.FC<IProps> = (props: IProps) => {
    const history = useHistory();
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
        const guidesResult = await props.assistantAppsApiService.getGuidesForUser(searchParams);
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

        return (
            <>
                {
                    (guidePagination?.value ?? []).map((guide: GuideSearchResultViewModel) => (
                        <UserGuideTile
                            key={guide.guid}
                            item={{ ...guide }}
                            onDeleteClick={async () => {
                                setFetchStatus(NetworkState.Loading);
                                await props.assistantAppsApiService.deleteGuide(guide.guid);
                                setFetchStatus(NetworkState.Success);
                            }}
                            onClick={() => {
                                history.push(
                                    editGuide.replace(editGuideParam, guide.guid)
                                );
                            }}
                        />
                    ))
                }
                <CreateUserGuideTile onClick={() => {
                    history.push(createGuide);
                }} />
            </>
        );
    }

    return (
        <>
            {banner}
            <div className="container">
                <div className="row full pt3 pb3">
                    {renderPageContent()}
                </div>
            </div>
            {
                (fetchStatus === NetworkState.Loading) && <Loading />
            }
        </>
    );
};

export const GuideListPage = withServices<IWithoutDepInj, IWithDepInj>(
    connect(mapStateToProps)(GuideListPageUnconnected),
    (services: IDependencyInjection) => ({
        assistantAppsApiService: services.assistantAppsApiService,
    })
);