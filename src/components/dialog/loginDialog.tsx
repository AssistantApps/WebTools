import React from 'react'
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import { Icon, Modal } from 'semantic-ui-react'
import { GoogleLogin } from 'react-google-login';
import { GoogleLoginButton } from "react-social-login-buttons";

import { OAuthUserViewModel } from '../../contracts/generated/ViewModel/oAuthUserViewModel';
import { OAuthProviderType } from '../../contracts/generated/Enum/oAuthProviderType';
import { mapStateToProps, mapDispatchToProps } from './loginDialog.redux';
import { ApiService } from '../../services/ApiService';

interface IState {
    isModalOpen: boolean;
    apiService: ApiService;
}

interface IProps {
    isLoading?: boolean;
    setLoadingStatus?: (isLoading: boolean) => void;
}

export class LoginDialogUnconnected extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isModalOpen: false,
            apiService: new ApiService(),
        };
    }

    toggleModalOpen = () => {
        this.setState((prevState: IState) => {
            return {
                isModalOpen: !prevState.isModalOpen
            }
        });
    }

    responseGoogle = (type: OAuthProviderType) => async (response: any) => {
        if (response == null ||
            response.tokenId == null ||
            response.profileObj == null ||
            response.accessToken == null ||
            response.profileObj.email == null ||
            response.profileObj.imageUrl == null ||
            response.profileObj.name == null) {
            this.oAuthLoginFailure();
            return;
        }
        this.toggleModalOpen();
        var apiObj: OAuthUserViewModel = {
            accessToken: response.accessToken,
            tokenId: response.tokenId,
            email: response.profileObj.email,
            oAuthType: type,
            profileUrl: response.profileObj.imageUrl,
            username: response.profileObj.name,
        }

        await this.state.apiService.loginWithOAuth(apiObj);
        if (this.props.setLoadingStatus) this.props.setLoadingStatus(false);
    }

    oAuthLoginFailure = () => {
        Swal.fire({
            title: 'Error!',
            text: 'Something went wrong and we could not log you in',
            icon: 'error',
        })
    }

    render() {
        return (
            <div style={{ lineHeight: '63px' }}>
                <Icon
                    name='user'
                    color='grey' inverted
                    size='large'
                    className="pointer"
                    onClick={this.toggleModalOpen}
                />

                <Modal
                    size='tiny'
                    dimmer='blurring'
                    open={this.state.isModalOpen}
                    onClose={this.toggleModalOpen}
                >
                    <Modal.Header>AssistantApps Login</Modal.Header>
                    <Modal.Content>
                        <div>
                            <GoogleLogin
                                clientId={window.config.googleClientId}
                                render={renderProps => (
                                    <GoogleLoginButton onClick={() => {
                                        if (this.props.setLoadingStatus) this.props.setLoadingStatus(true);
                                        renderProps.onClick();
                                    }}
                                        style={{ opacity: renderProps.disabled ? '50%' : null, maxWidth: '50%' }}
                                    />
                                )}
                                buttonText="Login"
                                onSuccess={this.responseGoogle(OAuthProviderType.google)}
                                onFailure={this.oAuthLoginFailure}
                                cookiePolicy={'single_host_origin'}
                            />
                        </div>
                    </Modal.Content>
                </Modal>
            </div>
        );
    }
}

export const LoginDialog = connect(mapStateToProps, mapDispatchToProps)(LoginDialogUnconnected);