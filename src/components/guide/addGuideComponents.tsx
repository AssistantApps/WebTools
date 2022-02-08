import React from 'react';
import { Card, Image } from 'semantic-ui-react';

interface IAddSection {
    onClick: () => void;
}
export const AddTextSection: React.FC<IAddSection> = (props: IAddSection) =>
    <BaseAddSection imgUrl="textItem.png" text="Text" onClick={props.onClick} />
export const AddLinkSection: React.FC<IAddSection> = (props: IAddSection) =>
    <BaseAddSection imgUrl="linkItem.png" text="Link" onClick={props.onClick} />
export const AddImageSection: React.FC<IAddSection> = (props: IAddSection) =>
    <BaseAddSection imgUrl="imageItem.png" text="Image" onClick={props.onClick} />
export const AddMarkdownSection: React.FC<IAddSection> = (props: IAddSection) =>
    <BaseAddSection imgUrl="textItem.png" text="Markdown" onClick={props.onClick} />

interface IBaseAddSectionProps {
    imgUrl: string;
    text: string;
    onClick: () => void;
}
const BaseAddSection: React.FC<IBaseAddSectionProps> = (props: IBaseAddSectionProps) => {
    return (
        <div className="guide-add-item col-3 col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-6" onClick={props.onClick}>
            <Card>
                <Image src={`/assets/img/guide/${props.imgUrl}`} wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{props.text}</Card.Header>
                </Card.Content>
            </Card>
        </div>
    );
}