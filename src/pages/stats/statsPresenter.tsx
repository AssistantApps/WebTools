import React from 'react';
import { Segment } from 'semantic-ui-react';

import { SmallBanner } from '../../components/common/banner/banner';
import { NumberOfTranslationsPerLanguageGraph } from '../../components/translationGraphs/numberOfTranslationsPerLanguage';

export const StatisticsPresenter: React.FC = () => {
    return (
        <>
            <SmallBanner
                title="Statistics"
                descrip="Public stats of the Assistant Apps"
            />
            <section>
                <Segment>
                    <div className="row align-items-center">
                        <div className="col-12">
                            <h1 style={{ textAlign: 'center' }} className="pt-2 mb-0">Translations submitted per Language</h1>
                            <NumberOfTranslationsPerLanguageGraph />
                        </div>
                    </div>
                </Segment>
            </section>
        </>
    );
};
