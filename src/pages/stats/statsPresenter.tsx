import React from 'react';
import { Segment } from 'semantic-ui-react';

import { SmallBanner } from '../../components/common/banner/banner';
import { SmallLoading } from '../../components/common/loading';
import { NumberOfTranslationsPerLanguageGraph } from '../../components/translationGraphs/numberOfTranslationsPerLanguage';
import { TranslatorLeaderboard } from '../../components/translatorLeaderboard/translatorLeaderboard';

export const StatisticsPresenter: React.FC = () => {
    return (
        <>
            <SmallBanner
                title="Statistics"
                descrip="Public stats of the Assistant Apps"
            />
            <section className="p1">
                <Segment raised>
                    <div className="row align-items-center">
                        <div className="col-12">
                            <h1 className="pt-2 pb1 mb-0 ta-center">Translations submitted per Language</h1>
                            <NumberOfTranslationsPerLanguageGraph />
                        </div>
                    </div>
                </Segment>
                <br />
                <Segment raised>
                    <div className="row align-items-center">
                        <div className="col-12">
                            <h1 className="pt-2 pb1 mb-0 ta-center">Top Translators</h1>
                            <TranslatorLeaderboard />
                            <br />
                            <br />
                        </div>
                    </div>
                </Segment>
                <br />
                <Segment raised>
                    <div className="row align-items-center">
                        <div className="col-12">
                            <h1 className="pt-2 pb1 mb-0 ta-center">Top Translators</h1>
                            <assistant-apps-translation-leaderboard>
                                <div slot="loading">
                                    <SmallLoading />
                                </div>
                            </assistant-apps-translation-leaderboard>
                            <br />
                            <br />
                        </div>
                    </div>
                </Segment>
            </section>
        </>
    );
};
