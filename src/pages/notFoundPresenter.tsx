import React from 'react';
import { SmallBanner } from '../components/common/banner/banner';

export const NotFoundPresenter: React.FC = () => {
    return (
        <>
            <SmallBanner
                title="Not Found"
                descrip="How did you get here?"
            />
            <div className="container" style={{ minHeight: '25vh' }}>
                <div className="row full pt3 pb1">
                    <div className="col-12" style={{ textAlign: 'center' }}>
                        <h3>
                            <br /><br />
                            The page you are looking for could not be found. Click <a href="/" title="home">here</a> to go to the home page.
                        </h3>
                    </div>
                </div>
            </div>
        </>
    );
};
