import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { connect } from 'react-redux';
import { GoogleLoginButton } from "react-social-login-buttons";
import { Icon, Modal } from 'semantic-ui-react';
import Swal from 'sweetalert2';
import { OAuthProviderType } from '../../contracts/generated/Enum/oAuthProviderType';
import { OAuthUserViewModel } from '../../contracts/generated/ViewModel/oAuthUserViewModel';
import { ILoginProps } from '../../contracts/login';
import { errorDialog } from '../../helper/dialogHelper';
import { IDependencyInjection, withServices } from '../../integration/dependencyInjection';
import { AssistantAppsApiService } from '../../services/api/AssistantAppsApiService';
import { ConditionalToolTip } from '../common/conditionalTooltip';
import { mapDispatchToProps, mapStateToProps } from './loginDialog.redux';

interface IWithDepInj {
    assistantAppsApiService: AssistantAppsApiService;
}
interface IWithoutDepInj {
    isLoading?: boolean;
    children?: React.ReactNode;
    iconStyle?: any;
    colour?: "grey" | "red" | "orange" | "yellow" | "olive" | "green" | "teal" | "blue" | "violet" | "purple" | "pink" | "brown" | "black";

    userGuid?: string;
    userProfileUrl?: string;
    userName?: string;
    showDialog?: boolean;

    setLoadingStatus?: (isLoading: boolean) => void;
    login?: (loginData: ILoginProps) => void;
    logout?: () => void;
}

interface IProps extends IWithDepInj, IWithoutDepInj { }


export const LoginDialogUnconnected: React.FC<IProps> = (props: IProps) => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const responseGoogle = (type: OAuthProviderType) => async (response: any) => {
        if (response == null ||
            response.tokenId == null ||
            response.profileObj == null ||
            response.accessToken == null ||
            response.profileObj.email == null ||
            response.profileObj.imageUrl == null ||
            response.profileObj.name == null) {
            oAuthLoginFailure({ custom: 'manual failure, response did not have expected values' });
            return;
        }
        setModalOpen(!isModalOpen);
        const apiObj: OAuthUserViewModel = {
            accessToken: response.accessToken,
            tokenId: response.tokenId,
            email: response.profileObj.email,
            oAuthType: type,
            profileUrl: response.profileObj.imageUrl,
            username: response.profileObj.name,
        }

        const loginResult = await props.assistantAppsApiService.loginWithOAuth(apiObj);
        setLoadingStatus(false);
        if (loginResult.isSuccess && props.login) {
            props.login(loginResult.value);
        } else {
            console.error(loginResult.errorMessage);
            errorDialog('Login failed', 'Unable to log in, please try again');
        }
    }

    const setLoadingStatus = (isLoading: boolean) => {
        if (props.setLoadingStatus) props.setLoadingStatus(isLoading);
    }

    const oAuthLoginFailure = (error: any) => {
        console.warn(error);
        setLoadingStatus(false);
        setModalOpen(false);
        Swal.fire({
            title: 'Login error!',
            text: `Something went wrong and we could not log you in. ${error.details}`,
            icon: 'error',
        });
    }

    const oAuthLogout = () => {
        Swal.fire({
            title: 'Logout?',
            text: `Are you sure that you want to logout?`,
            icon: 'question',
            allowEnterKey: true,
            allowEscapeKey: true,
            showCancelButton: true,
        }).then((answer: any) => {
            if (answer.isConfirmed) {
                if (props.logout) props.logout();
            }
        });
    }

    const toggleModalOpen = () => setModalOpen(!isModalOpen);

    const LoginComponent = (props.userGuid != null && props.userGuid.length > 5)
        ? (
            <span className="nav-link pointer" onClick={oAuthLogout}>
                <ConditionalToolTip
                    message={props.userName || ''}
                    showToolTip={props.userName != null && props.userName.length > 1}>
                    <img className="oauth-circle" src={props.userProfileUrl} alt={props.userName} />
                </ConditionalToolTip>
            </span>
        )
        : (
            <span className="nav-link pointer"
                onClick={toggleModalOpen}>
                <Icon
                    inverted
                    name="user"
                    color={props.colour || "grey"}
                    size="large"
                    className="pointer"
                    style={props.iconStyle || {}}
                />Login</span>
        );

    const googleLoginButton = (
        <GoogleLogin
            clientId={window.config.googleClientId}
            render={renderProps => (
                <GoogleLoginButton onClick={() => {
                    setLoadingStatus(true);
                    renderProps.onClick();
                }}
                    style={{ opacity: renderProps.disabled ? '50%' : null, maxWidth: '50%' }}
                />
            )}
            style={{
                backgroundColor: 'red',
            }}
            buttonText="Login"
            onSuccess={responseGoogle(OAuthProviderType.google)}
            onFailure={oAuthLoginFailure}
            cookiePolicy={'single_host_origin'}
        />
    );

    if (props.showDialog === false) {
        return googleLoginButton;
    }

    return (
        <>
            {
                props.children != null
                    ? <div className="pointer" onClick={toggleModalOpen}>
                        {props.children}
                    </div>
                    : LoginComponent
            }

            <Modal
                size="tiny"
                dimmer="blurring"
                open={isModalOpen}
                onClose={toggleModalOpen}
            >
                <Modal.Header>AssistantApps Login</Modal.Header>
                <Modal.Content>{googleLoginButton}</Modal.Content>
            </Modal>
        </>
    );
}

export const LoginDialog = withServices<IWithoutDepInj, IWithDepInj>(
    connect(mapStateToProps, mapDispatchToProps)(LoginDialogUnconnected),
    (services: IDependencyInjection) => ({
        assistantAppsApiService: services.assistantAppsApiService,
    })
);
