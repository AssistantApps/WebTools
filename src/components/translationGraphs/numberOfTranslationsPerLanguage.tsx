import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Menu } from 'semantic-ui-react';

import { NetworkState } from '../../constants/networkState';
import { DropDownWithIcon } from '../../contracts/dropdown/dropDownWithIcon';
import { AppViewModel } from '../../contracts/generated/ViewModel/appViewModel';
import { TranslationGetGraphViewModel } from '../../contracts/generated/ViewModel/Translation/translationGetGraphViewModel';
import { TranslationsPerLanguageGraphViewModel } from '../../contracts/generated/ViewModel/Translation/translationsPerLanguageGraphViewModel';

import { SmallLoading } from '../common/loading';
import { DropDown } from '../common/dropDown/dropDown';
import { SteppedAxisTick, FlagAxisTick } from '../common/graph/xAxis';
import { TooltipWithFlag } from '../common/graph/tooltipWithFlag';

import { appDetailsToAppDropDownMapper } from '../../mapper/appDetailsMapper';
import { getColourFromLanguageCode } from '../../mapper/languageColourMapper';

import { ApiService } from '../../services/ApiService';

interface IState {
    searchObj: TranslationGetGraphViewModel;
    graphData: Array<TranslationsPerLanguageGraphViewModel>;
    graphDataStatus: NetworkState;
    tabPaneData: Array<any>;
    isFlagMode: boolean;

    appStatus: NetworkState;
    appDropDowns: Array<DropDownWithIcon>;
    selectedApps: Array<string>;

    apiService: ApiService;
}

interface IProps {
}

export class NumberOfTranslationsPerLanguageGraph extends React.Component<IProps, IState> {
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

            apiService: new ApiService(),
        };
    }

    componentDidMount() {
        this.fetchAppData();
        this.fetchGraphData(this.state.searchObj);
    }

    fetchAppData = async () => {
        var appsResult = await this.state.apiService.getApps();
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
        var appsResult = await this.state.apiService.getTranslationsPerLangGraphData(searchObj);
        if (!appsResult.isSuccess) {
            this.setState(() => {
                return {
                    graphDataStatus: NetworkState.Error
                }
            });
            return;
        }
        this.setState(() => {
            return {
                graphData: appsResult.value.slice(0, 10),
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
        if (this.state.graphDataStatus === NetworkState.Error) return <p>Error</p>

        return (
            <>
                <div className="row justify-content-center pl-4 pb-2">
                    <div className="col-12 col-lg-10">
                        <label>Please select Apps to display data for</label>
                        {
                            (this.state.appStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder="Select Apps"
                                    options={this.state.appDropDowns}
                                    multiple={true}
                                    value={this.state.selectedApps}
                                    isLoading={this.state.appStatus === NetworkState.Loading}
                                    onChange={(apps: any) => this.setApps(apps)}
                                />
                                : <p>Error loading apps, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-12 col-lg-1">
                        <label>Chart mode</label><br />
                        <Menu compact>
                            {
                                this.state.tabPaneData.map((data: any) => {
                                    return (
                                        <Menu.Item link
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
                        <ResponsiveContainer width="100%" height={500} className="m-4">
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
                                    <Label value="Number of Translations" offset={0} position="left"
                                        angle={-90}
                                        fontSize={14}
                                        fill='#676767' />
                                </YAxis>
                                <Tooltip content={<TooltipWithFlag />} />
                                <Bar dataKey="numTranslations" name="Translations" fill="#3ad7ec">
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