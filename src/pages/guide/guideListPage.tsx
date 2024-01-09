import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Dropdown, Form, Icon, Input } from 'semantic-ui-react';
import { useLocation } from 'wouter';
import { SmallBanner } from '../../components/common/banner/banner';
import { Error } from '../../components/common/error';
import { SmallLoading } from '../../components/common/loading';
import { LoginRequired } from '../../components/common/loginRequired';
import { CreateUserGuideTile, UserGuideTile } from '../../components/guide/userGuideTile';
import { AdminAprovalStatusOptions, DefaultAdminAprovalStatusSelection } from '../../constants/dropDown';
import { NetworkState } from '../../constants/networkState';
import { createGuide, editGuide, editGuideParam } from '../../constants/route';
import { PaginationWithValue } from '../../contracts/pagination/paginationWithValue';
import { anyObject } from '../../helper/typescriptHacks';
import { DependencyInjectionContext } from '../../integration/dependencyInjection';
import { mapStateToProps } from './guidListPage.Redux';
import { AdminApprovalStatus, GuideSearchResultViewModel } from '@assistantapps/assistantapps.api.client';

interface IFromRedux {
    userGuid: string;
    userName: string;
}

interface IProps extends IFromRedux { }

const defaultSelection = AdminAprovalStatusOptions.filter(opt => DefaultAdminAprovalStatusSelection.map(sel => AdminApprovalStatus[sel]).includes(opt.value)).map(opt => opt.value)

export const GuideListPageUnconnected: React.FC<IProps> = (props: IProps) => {
    const [, setLocation] = useLocation();
    const services = useContext(DependencyInjectionContext);
    const [fetchStatus, setFetchStatus] = useState<NetworkState>(NetworkState.Pending);
    const [guidePagination, setGuidePagination] = useState<PaginationWithValue<Array<GuideSearchResultViewModel>>>(anyObject);
    const [aprovalSelection, setAprovalSelection] = useState<Array<string>>(defaultSelection);

    useEffect(() => {
        const isNotLoggedIn = props.userGuid == null || props.userGuid.length < 1;
        if (isNotLoggedIn) return;

        if (fetchStatus === NetworkState.Loading) return;
        fetchUserGuides();
        // eslint-disable-next-line
    }, [props.userGuid]);

    const fetchUserGuides = async (localAprovalSelection?: Array<string>) => {
        setFetchStatus(NetworkState.Loading);
        const searchParams: any = {
            page: 1,
            approvalStatusesToShow: localAprovalSelection ?? aprovalSelection,
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
                    <div className="col-12 col-md-12 mb-3">
                        <Form>
                            <Form.Group>
                                <Form.Field width="6" className="pt1">
                                    <label>Guides for:</label>
                                    <Input className="noselect" value={props.userName} disabled />
                                </Form.Field>
                                <Form.Field width="9" className="pt1">
                                    <label>Filter</label>
                                    <Dropdown
                                        placeholder="All"
                                        fluid
                                        multiple
                                        search
                                        selection
                                        value={(aprovalSelection ?? [])}
                                        onChange={(_, { value }: any) => {
                                            setAprovalSelection(value);
                                            fetchUserGuides(value);
                                        }}
                                        options={AdminAprovalStatusOptions}
                                    />
                                </Form.Field>
                                <Form.Field width="1" className="pt1">
                                    <label>&nbsp;</label>
                                    <Button icon onClick={() => {
                                        setAprovalSelection(defaultSelection);
                                        fetchUserGuides(defaultSelection);
                                    }}>
                                        <Icon name='refresh' />
                                    </Button>
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </div>
                    {renderPageContent()}
                </div>
            </div>
        </div>
    );
};

export const GuideListPage: any = connect(mapStateToProps)(GuideListPageUnconnected);
