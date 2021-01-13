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
    children?: React.ReactNode;
    iconStyle?: any;
    colour?: "grey" | "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "black";
    setLoadingStatus?: (isLoading: boolean) => void;
    login?: (userGuid: string) => void;
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

        var loginResult = await this.state.apiService.loginWithOAuth(apiObj);
        this.setLoadingStatus(false);
        if (loginResult.isSuccess) {
            if (this.props.login) this.props.login(loginResult.value);
        }
    }

    setLoadingStatus = (isLoading: boolean) => {
        if (this.props.setLoadingStatus) this.props.setLoadingStatus(isLoading);
    }

    oAuthLoginFailure = () => {
        this.setLoadingStatus(false);
        Swal.fire({
            title: 'Login error!',
            text: 'Something went wrong and we could not log you in',
            icon: 'error',
        })
    }

    render() {
        return (
            <>
                {
                    this.props.children != null
                        ? <div className="pointer" onClick={this.toggleModalOpen}>
                            {this.props.children}
                        </div>
                        : <span className="nav-link pointer"
                            onClick={this.toggleModalOpen}>
                            <Icon
                                inverted
                                name="user"
                                color={this.props.colour || "grey"}
                                size="large"
                                className="pointer"
                                style={this.props.iconStyle || {}}
                            />Login</span>

                }

                <Modal
                    size="tiny"
                    dimmer="blurring"
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
                                        this.setLoadingStatus(true);
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
            </>
        );
    }
}

export const LoginDialog = connect(mapStateToProps, mapDispatchToProps)(LoginDialogUnconnected);