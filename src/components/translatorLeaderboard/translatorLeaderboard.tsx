import React, { useEffect, useState } from 'react';
import { List, Image } from 'semantic-ui-react';
import { NetworkState } from '../../constants/networkState';
import { AssistantAppsApiService } from '../../services/api/AssistantAppsApiService';
import { TranslatorLeaderboardItemViewModel } from '../../contracts/generated/ViewModel/Translation/translatorLeaderboardItemViewModel';
import { SmallLoading } from '../common/loading';
import { IDependencyInjection, withServices } from '../../integration/dependencyInjection';

interface IWithDepInj {
    assistantAppsApiService: AssistantAppsApiService;
}
interface IWithoutDepInj {
}

interface IProps extends IWithDepInj, IWithoutDepInj { }

export const TranslatorLeaderboardUnconnected: React.FC<IProps> = (props: IProps) => {
    const [networkState, setNetworkState] = useState<NetworkState>(NetworkState.Loading);
    const [translators, setTranslators] = useState<Array<TranslatorLeaderboardItemViewModel>>([]);

    useEffect(() => {
        fetchTranslators();
        // eslint-disable-next-line
    }, [])

    const fetchTranslators = async () => {
        const translatorsResult = await props.assistantAppsApiService.getTranslators({});
        if (!translatorsResult.isSuccess) {
            setNetworkState(NetworkState.Error);
            return;
        }

        setTranslators((translatorsResult.value as any).value);
        setNetworkState(NetworkState.Success);
    }

    if (networkState === NetworkState.Loading) return <SmallLoading />
    if (networkState === NetworkState.Error) return (
        <p style={{ textAlign: 'center' }}>
            <span aria-label="cross" role="img">❌</span>Error getting leaderboard
        </p>
    );

    return (
        <div style={{ paddingLeft: '2em', paddingRight: '2em' }}>
            <div className="row">
                {
                    (translators ?? []).map((translator, index: number) => (
                        <div key={`${translator.username}-${translator.total}`} className="col-12 col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-20 translator-card">
                            <div className="num noselect"><h2><small>#</small>{index + 1}</h2></div>
                            <div className="translator">
                                <Image src={translator.profileImageUrl} size='tiny' className="noselect" />
                                <List.Content className="content">
                                    <List.Header as='h2'>{translator.username}</List.Header>
                                    <List.Description as='h3'>{translator.total} points</List.Description>
                                </List.Content>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export const TranslatorLeaderboard = withServices<IWithoutDepInj, IWithDepInj>(
    TranslatorLeaderboardUnconnected,
    (services: IDependencyInjection) => ({
        assistantAppsApiService: services.assistantAppsApiService,
    })
);