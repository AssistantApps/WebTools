import React, { useEffect, useState } from 'react';
import { List, Image } from 'semantic-ui-react';
import { NetworkState } from '../../constants/networkState';
import { TranslatorLeaderboardItemViewModel } from '../../contracts/generated/ViewModel/Translation/translatorLeaderboardItemViewModel';
import { ApiService } from '../../services/ApiService';
import { SmallLoading } from '../common/loading';

interface IProps {
}

export const TranslatorLeaderboard: React.FC<IProps> = (props: IProps) => {
    const [networkState, setNetworkState] = useState<NetworkState>(NetworkState.Loading);
    const [translators, setTranslators] = useState<Array<TranslatorLeaderboardItemViewModel>>([]);

    useEffect(() => {

        fetchTranslators();
    }, [])

    const fetchTranslators = async () => {
        const apiService = new ApiService();
        const translatorsResult = await apiService.getTranslators({});
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
            <List divided relaxed ordered>
                {
                    (translators ?? []).map((translator) => (
                        <List.Item key={`${translator.username}-${translator.total}`} className="translator">
                            <Image src={translator.profileImageUrl} size='tiny' />
                            <List.Content className="content">
                                <List.Header as='h2'>{translator.username}</List.Header>
                                <List.Description as='h3'>{translator.total} points</List.Description>
                            </List.Content>
                        </List.Item>
                    ))
                }
            </List>
        </div>
    );
}