import React, { useState } from 'react';
import { Form, Icon, Label } from 'semantic-ui-react';
import { GuideSectionItemType } from '../../contracts/generated/Enum/guideSectionItemType';
import { GuideSectionItemViewModel } from '../../contracts/generated/ViewModel/Guide/guideSectionItemViewModel';
import { MarkdownRenderer } from '../../components/common/markdown';

interface ISectionItemProps {
    index: number;
    totalLength: number;
    item: GuideSectionItemViewModel;
    saveItem: (sectionItemId: string, name: string, value: string) => void;
    moveItem: (sectionItemId: string, moveDown: boolean) => void;
    deleteItem: (sectionItemId: string) => void;
}

export const SectionItem: React.FC<ISectionItemProps> = (props: ISectionItemProps) => {

    const renderContents = (item: GuideSectionItemViewModel) => {
        switch (item.type) {
            case GuideSectionItemType.text:
                return <TextSectionItemContent {...props} />
            case GuideSectionItemType.image:
                return <ImageSectionItemContent {...props} />
            case GuideSectionItemType.link:
                return <LinkSectionItemContent {...props} />
            case GuideSectionItemType.markdown:
                return <MarkdownSectionItemContent {...props} />
        }
        return (<span></span>);
    }

    return (
        <div className="guide-item card noselect">
            <div className="card-header">
                <Form>
                    {renderContents(props.item)}
                </Form>

                <ActionButtons
                    index={props.index}
                    totalLength={props.totalLength}
                    saveItem={(name: string, value: string) => props.saveItem(props.item.guid, name, value)}
                    moveItem={(moveDown: boolean) => props.moveItem(props.item.guid, moveDown)}
                    deleteItem={() => props.deleteItem(props.item.guid)}
                />
            </div>
        </div>
    );
}

interface IActionButtonsProps {
    index: number;
    totalLength: number;
    additionalClassName?: string;
    saveItem: (name: string, value: string) => void;
    moveItem: (moveDown: boolean) => void;
    deleteItem: () => void;
}
export const ActionButtons: React.FC<IActionButtonsProps> = (props: IActionButtonsProps) => {
    return (
        <div className={`action-buttons ${props.additionalClassName}`}>
            {
                (props.index > 0) &&
                <Label color='blue' className="pointer" onClick={() => props.moveItem(false)}>
                    <Icon name="arrow up" />Move up
                </Label>
            }
            {
                (props.index < (props.totalLength - 1)) &&
                <Label color='blue' className="pointer" onClick={() => props.moveItem(true)}>
                    <Icon name="arrow down" />Move down
                </Label>
            }

            <Label color='red' className="pointer" onClick={props.deleteItem}>
                <Icon name="trash" />Delete
            </Label>
        </div>

    );
}

const handleBlurEvent = (e: any) => {
    e?.persist?.();
    const value = e?.target?.value ?? '';
    return value;
}

export const TextSectionItemContent: React.FC<ISectionItemProps> = (props: ISectionItemProps) => {
    return (
        <Form.Group>
            <Form.Field width="16">
                <label>Text</label>
                <textarea placeholder='How to...'
                    defaultValue={props.item.content}
                    autoFocus={(props.item as any).isNew}
                    onBlur={(e: any) => {
                        const value = handleBlurEvent(e);
                        props.saveItem(props.item.guid, 'content', value);
                    }} />
            </Form.Field>
        </Form.Group>
    );
}

export const LinkSectionItemContent: React.FC<ISectionItemProps> = (props: ISectionItemProps) => {
    return (
        <Form.Group>
            <Form.Field width="6">
                <label>Name</label>
                <div className="ui input">
                    <input placeholder="Click here" type="text"
                        defaultValue={props.item.content}
                        autoFocus={(props.item as any).isNew}
                        onBlur={(e: any) => {
                            const value = handleBlurEvent(e);
                            props.saveItem(props.item.guid, 'content', value);
                        }}
                    />
                </div>
            </Form.Field>
            <Form.Field width="10">
                <label>Url</label>
                <div className="ui input">
                    <input placeholder="https://google.com" type="text"
                        defaultValue={props.item.additionalContent}
                        onBlur={(e: any) => {
                            const value = handleBlurEvent(e);
                            props.saveItem(props.item.guid, 'additionalContent', value);
                        }}
                    />
                </div>
            </Form.Field>
        </Form.Group>
    );
}

export const ImageSectionItemContent: React.FC<ISectionItemProps> = (props: ISectionItemProps) => {
    return (
        <Form.Group>
            <Form.Field width="16">
                <label>Url</label>
                <input placeholder="https://imgur.com" type="text"
                    defaultValue={props.item.content}
                    autoFocus={(props.item as any).isNew}
                    onBlur={(e: any) => {
                        const value = handleBlurEvent(e);
                        props.saveItem(props.item.guid, 'content', value);
                    }}
                />
            </Form.Field>
        </Form.Group>
    );
}

export const MarkdownSectionItemContent: React.FC<ISectionItemProps> = (props: ISectionItemProps) => {
    const [localMarkdown, setLocalMarkdown] = useState<string>(props.item.content);

    return (
        <Form.Group>
            <Form.Field width="8">
                <label>Markdown</label>
                <textarea placeholder='How to...'
                    defaultValue={props.item.content}
                    autoFocus={(props.item as any).isNew}
                    onBlur={(e: any) => {
                        props.saveItem(props.item.guid, 'content', localMarkdown);
                    }}
                    onChange={(e: any) => {
                        const value = handleBlurEvent(e);
                        setLocalMarkdown(value);
                    }}
                />
            </Form.Field>
            <Form.Field width="8">
                <div style={{ paddingTop: '1.5em' }}>
                    <MarkdownRenderer markdown={localMarkdown} />
                </div>
            </Form.Field>
        </Form.Group>
    );
}