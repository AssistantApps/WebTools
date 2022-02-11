import React, { ReactNode } from 'react';
import { Card, Icon, Label } from 'semantic-ui-react';
import { AdminApprovalStatus } from '../../contracts/generated/Enum/adminApprovalStatus';
import { GuideSearchResultViewModel } from '../../contracts/generated/ViewModel/Guide/guideSearchResultViewModel';
import { friendlyDate } from '../../helper/dateHelper';

interface IUserGuideTileProps {
    item: GuideSearchResultViewModel;
    onDeleteClick?: () => void;
    onClick?: () => void;
}
export const UserGuideTile: React.FC<IUserGuideTileProps> = (props: IUserGuideTileProps) => {
    const deleteClick = (e: any) => {
        e?.preventDefault?.();
        props?.onDeleteClick?.();
    }
    return (
        <div className="col-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <Card className="guide">
                {/* <Image src={props.} wrapped ui={false} /> */}
                <Card.Content className="pointer pos-rel" onClick={props.onClick}>
                    <Card.Header>
                        {props.item.title}
                        <Icon name="pencil" className="pos-abs top-right" />
                    </Card.Header>
                    <Card.Meta>{friendlyDate(props.item.dateCreated)}</Card.Meta>
                    <Card.Description><b>Subtitle: </b>{props.item.subTitle}</Card.Description>
                    <Card.Description><b>Tags: </b>{props.item.tags.join(', ')}</Card.Description>
                </Card.Content>
                <Card.Content className="pointer" extra onClick={props.onClick}>
                    <Card.Description><b>Version: </b>{props.item.version}</Card.Description>
                    <Card.Description><b>Status: </b>{AdminApprovalStatus[props.item.status].toString()}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Label color='red' className="pointer" onClick={deleteClick}>
                        <Icon name="trash" />Delete
                    </Label>
                </Card.Content>
            </Card>
        </div>
    );
}

interface ICreateUserGuideTileProps {
    onClick?: () => void;
}
export const CreateUserGuideTile: React.FC<ICreateUserGuideTileProps> = (props: ICreateUserGuideTileProps) => {
    return (
        <BaseUserGuideTile
            headerContent={(
                <div style={{ textAlign: 'center' }}>
                    <Icon name='plus' size='huge' />
                </div>
            )}
            bodyContent={(<h3>Create new Guide</h3>)}
            onClick={props.onClick}
        />
    );
}

interface IBaseUserGuideTileProps {
    headerContent: ReactNode;
    bodyContent: ReactNode;
    onClick?: () => void;
}
const BaseUserGuideTile: React.FC<IBaseUserGuideTileProps> = (props: IBaseUserGuideTileProps) => {
    return (
        <div className="col-3 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <div className="card guide pointer" onClick={props.onClick}>
                <div className="card-header">
                    {props.headerContent}
                </div>
                <div className="card-body">
                    {props.bodyContent}
                </div>
            </div>
        </div>
    );
}