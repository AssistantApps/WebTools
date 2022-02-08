import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Menu } from 'semantic-ui-react';
import { NetworkState } from '../../constants/networkState';
import { DropDownWithIcon } from '../../contracts/dropdown/dropDownWithIcon';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { TranslationGetGraphViewModel } from '../../contracts/generated/ViewModel/Translation/translationGetGraphViewModel';
import { TranslationsPerLanguageGraphViewModel } from '../../contracts/generated/ViewModel/Translation/translationsPerLanguageGraphViewModel';
import { IDependencyInjection, withServices } from '../../integration/dependencyInjection';
import { appDetailsToAppDropDownMapper } from '../../mapper/appDetailsMapper';
import { getColourFromLanguageCode } from '../../mapper/languageColourMapper';
import { AssistantAppsApiService } from '../../services/api/AssistantAppsApiService';
import { DropDown } from '../common/dropDown/dropDown';
import { TooltipWithFlag } from '../common/graph/tooltipWithFlag';
import { FlagAxisTick, SteppedAxisTick } from '../common/graph/xAxis';
import { SmallLoading } from '../common/loading';

interface IWithDepInj {
    assistantAppsApiService: AssistantAppsApiService;
}
interface IWithoutDepInj {
}

interface IProps extends IWithDepInj, IWithoutDepInj { }

interface IState {
    searchObj: TranslationGetGraphViewModel;
    graphData: Array<TranslationsPerLanguageGraphViewModel>;
    graphDataStatus: NetworkState;
    tabPaneData: Array<any>;
    isFlagMode: boolean;

    appStatus: NetworkState;
    appDropDowns: Array<DropDownWithIcon>;
    selectedApps: Array<string>;
}

export class NumberOfTranslationsPerLanguageGraphUnconnected extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            searchObj: { appGuidList: [] },
            graphData: Array<TranslationsPerLanguageGraphViewModel>(),
            graphDataStatus: NetworkState.Loading,
            tabPaneData: [
                { menuItem: 'Flags', isFlagMode: true },
                { menuItem: 'Text', isFlagMode: false },
            ],
            isFlagMode: true,

            appStatus: NetworkState.Loading,
            appDropDowns: Array<DropDownWithIcon>(),
            selectedApps: Array<string>(),
        };
    }

    componentDidMount() {
        this.fetchAppData();
        this.fetchGraphData(this.state.searchObj);
    }

    fetchAppData = async () => {
        var appsResult = await this.props.assistantAppsApiService.getApps();
        if (!appsResult.isSuccess) {
            this.setState(() => {
                return {
                    appStatus: NetworkState.Error
                }
            });
            return;
        }

        this.setState(() => {
            return {
                appDropDowns: appDetailsToAppDropDownMapper(appsResult.value),
                selectedApps: appsResult.value.map((app: AppViewModel) => app.guid),
                appStatus: NetworkState.Success
            }
        });
    }

    fetchGraphData = async (searchObj: TranslationGetGraphViewModel) => {
        var appsResult = await this.props.assistantAppsApiService.getTranslationsPerLangGraphData(searchObj);
        if (!appsResult.isSuccess) {
            this.setState(() => {
                return {
                    graphDataStatus: NetworkState.Error
                }
            });
            return;
        }
        const screenWidth = window.innerWidth;
        let graphCols = 15;
        if (screenWidth < 1000) {
            graphCols = 10
        }
        if (screenWidth < 700) {
            graphCols = 5
        }
        this.setState(() => {
            return {
                graphData: appsResult.value.slice(0, graphCols),
                graphDataStatus: NetworkState.Success
            }
        });
    }

    setApps = (apps: Array<string>) => {
        const newSearchObj: TranslationGetGraphViewModel = {
            appGuidList: apps,
        }
        this.setState(() => {
            return {
                selectedApps: apps,
                searchObj: newSearchObj,
            }
        });
        this.fetchGraphData(newSearchObj);
    }

    changeMode = (isFlagMode: boolean) => {
        this.setState(() => {
            return {
                isFlagMode
            }
        });
    }

    render() {
        if (this.state.graphDataStatus === NetworkState.Loading) return <SmallLoading />
        if (this.state.graphDataStatus === NetworkState.Error) return (
            <p style={{ textAlign: 'center' }}>
                <span aria-label="cross" role="img">❌</span>Error getting chart data
            </p>
        );

        return (
            <>
                <div className="row justify-content-center pr-4 pb-2 pl-4">
                    <div className="col-12 col-lg-9 col-md-8 col-sm-7">
                        <label>Please select Apps to display data for</label>
                        {
                            (this.state.appStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder="Select Apps"
                                    options={this.state.appDropDowns}
                                    multiple={true}
                                    defaultValue={this.state.selectedApps}
                                    isLoading={this.state.appStatus === NetworkState.Loading}
                                    onChange={(apps: any) => this.setApps(apps)}
                                />
                                : <p>Error loading apps, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-12 col-lg-2 col-md-3 col-sm-4 ta-center col-sm-pt1">
                        <label>Chart mode</label><br />
                        <Menu compact>
                            {
                                this.state.tabPaneData.map((data: any) => {
                                    return (
                                        <Menu.Item link
                                            key={data.menuItem}
                                            active={data.isFlagMode === this.state.isFlagMode}
                                            onClick={() => this.changeMode(data.isFlagMode)}>
                                            {data.menuItem}
                                        </Menu.Item>
                                    );
                                })
                            }
                        </Menu>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <ResponsiveContainer width="100%" height={500} className="m-4 unset-width">
                            <BarChart
                                data={this.state.graphData}
                                margin={{ top: 0, right: 50, left: 20, bottom: 30 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis height={40}
                                    interval={0}
                                    dataKey={this.state.isFlagMode ? "countryCode" : "name"}
                                    tick={this.state.isFlagMode ? <FlagAxisTick /> : <SteppedAxisTick />}>
                                    <Label value="Supported Languages" offset={15} position="bottom"
                                        fontSize={14}
                                        fill='#676767' />
                                </XAxis>
                                <YAxis>
                                    <Label value="Percentage Complete" offset={0} position="left"
                                        angle={-90}
                                        fontSize={14}
                                        fill='#676767' />
                                </YAxis>
                                <Tooltip content={<TooltipWithFlag />} />
                                <Bar dataKey="percentage" name="Percentage" fill="#3ad7ec">
                                    {
                                        this.state.graphData.map((entry: TranslationsPerLanguageGraphViewModel, index) => (
                                            <Cell
                                                key={`cell-${entry.guid}`}
                                                fill={getColourFromLanguageCode(this.state.graphData[index].languageCode)}
                                            >
                                            </Cell>
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </>
        );
    }
}

export const NumberOfTranslationsPerLanguageGraph = withServices<IWithoutDepInj, IWithDepInj>(
    NumberOfTranslationsPerLanguageGraphUnconnected,
    (services: IDependencyInjection) => ({
        assistantAppsApiService: services.assistantAppsApiService,
    })
);