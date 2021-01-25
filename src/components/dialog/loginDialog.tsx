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
import { ILoginProps } from '../../contracts/login';
import { ConditionalToolTip } from '../common/conditionalTooltip';

interface IState {
    isModalOpen: boolean;
    apiService: ApiService;
}

interface IProps {
    isLoading?: boolean;
    children?: React.ReactNode;
    iconStyle?: any;
    colour?: "grey" | "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "black";

    userGuid?: string;
    userProfileUrl?: string;
    userName?: string;

    setLoadingStatus?: (isLoading: boolean) => void;
    login?: (loginData: ILoginProps) => void;
    logout?: () => void;
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
            this.oAuthLoginFailure({ custom: 'manual failure, response did not have expected values' });
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
        if (loginResult.isSuccess && this.props.login) {
            this.props.login(loginResult.value);
        }
    }

    setLoadingStatus = (isLoading: boolean) => {
        if (this.props.setLoadingStatus) this.props.setLoadingStatus(isLoading);
    }

    oAuthLoginFailure = (error: any) => {
        console.warn(error);
        this.setLoadingStatus(false);
        this.setState(() => {
            return {
                isModalOpen: false
            }
        });
        Swal.fire({
            title: 'Login error!',
            text: `Something went wrong and we could not log you in. ${error.details}`,
            icon: 'error',
        });
    }

    oAuthLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: `Are you sure that you want to logout?`,
            icon: 'question',
            allowEnterKey: true,
            allowEscapeKey: true,
            showCancelButton: true,
        }).then((answer: any) => {
            if (answer.isConfirmed) {
                if (this.props.logout) this.props.logout();
            }
        });
    }

    render() {
        const LoginComponent = (this.props.userGuid != null && this.props.userGuid.length > 5)
            ? (
                <span className="nav-link pointer" onClick={this.oAuthLogout}>
                    <ConditionalToolTip
                        message={this.props.userName || ''}
                        showToolTip={this.props.userName != null && this.props.userName.length > 1}>
                        <img className="oauth-circle" src={this.props.userProfileUrl} alt={this.props.userName} />
                    </ConditionalToolTip>
                </span>
            )
            : (
                <span className="nav-link pointer"
                    onClick={this.toggleModalOpen}>
                    <Icon
                        inverted
                        name="user"
                        color={this.props.colour || "grey"}
                        size="large"
                        className="pointer"
                        style={this.props.iconStyle || {}}
                    />Login</span>
            )
        return (
            <>
                {
                    this.props.children != null
                        ? <div className="pointer" onClick={this.toggleModalOpen}>
                            {this.props.children}
                        </div>
                        : LoginComponent

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