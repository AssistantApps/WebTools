import React from 'react';
import { Segment, Button } from 'semantic-ui-react';

import { LoginDialog } from '../../components/dialog/loginDialog';

interface IProps {
}

export const TranslationLogInPresenter: React.FC<IProps> = (props: IProps) => {

    return (
        <div className="container">
            <div className="row full pb3">
                <div className="col-12 pt1">
                    <Segment placeholder style={{ minHeight: 'unset' }}>
                        <h2 style={{ textAlign: 'center', padding: '.25em' }}>
                            <span>Please log in</span>
                            <LoginDialog colour="black">
                                <Button style={{ marginTop: '.5em' }}>Click here to login</Button>
                            </LoginDialog>
                        </h2>
                        <div className="pb-4">
                            <h3 className="m0"><b>Why do I need to be logged in?</b></h3>
                            <p>This is one step to prevent DoS (Denial of Service) attacks. The translations shown here are the work of amazing individuals who have put a lot of effort into these translations. It would not be fair for people to take that work without their permission. By requiring a login in order to view the translations, we can track and block accounts that are trying to get all of these translations.</p>
                        </div>
                        <div className="pb-4">
                            <h3 className="m0"><b>What do you store from my Google login?</b></h3>
                            <p>Your Email Address and Profile Image Url. We do not store Passwords, your Password is safe with Google we do not even interact with your Password. Google does an extremely good job of keeping that secret. This data is used to link translations to your AssistantApps account, so that giving credit for submitting translations as well as voting on existing translations can be automated. Please feel free contact me at <a href="mailto:support@assistantapps.com">support@assistantapps.com</a>&nbsp;if you have any concerns of how this data is stored.</p>
                        </div>
                        <div className="pb-4">
                            <h3 className="m0"><b>How long do you store my data?</b></h3>
                            <p>There is a process that runs every 24 hours that looks for and replaces the data of accounts that have not been logged into for over 36 months. This process replaces your email address with the AssistantApps support email and replaces your Profile Image Url with a default user image. This is done to preserve the links to other data in the database while removing your data from being visible and/or extracted if there is a data leak.</p>
                        </div>
                    </Segment>
                </div>
            </div>
        </div>
    );
};
