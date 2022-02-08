import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { useParams } from "react-router-dom";
import { Form, Icon, Input, InputOnChangeData, Popup } from 'semantic-ui-react';
import { SmallBanner } from '../../components/common/banner/banner';
import { ConditionalToolTip } from '../../components/common/conditionalTooltip';
import { DropDown } from '../../components/common/dropDown/dropDown';
import { Error } from '../../components/common/error';
import { Loading } from '../../components/common/loading';
import { LoginRequired } from '../../components/common/loginRequired';
import { BaseDialog } from '../../components/common/modal/baseDialog';
import { TagsFormInput } from '../../components/common/tagComponent';
import { AddImageSection, AddLinkSection, AddMarkdownSection, AddTextSection } from '../../components/guide/addGuideComponents';
import { NetworkState } from '../../constants/networkState';
import { guides } from '../../constants/route';
import { DropDownWithIcon } from '../../contracts/dropdown/dropDownWithIcon';
import { GuideSectionItemType } from '../../contracts/generated/Enum/guideSectionItemType';
import { AddGuideViewModel } from '../../contracts/generated/ViewModel/Guide/addGuideViewModel';
import { GuideSectionItemViewModel } from '../../contracts/generated/ViewModel/Guide/guideSectionItemViewModel';
import { GuideSectionViewModel } from '../../contracts/generated/ViewModel/Guide/guideSectionViewModel';
import { errorDialog, getStringDialog, successDialog } from '../../helper/dialogHelper';
import { newGuid } from '../../helper/guidHelper';
import { IDependencyInjection, withServices } from '../../integration/dependencyInjection';
import { appDetailsToAppDropDownMapper } from '../../mapper/appDetailsMapper';
import { languageDetailsToLanguageDropDownMapper } from '../../mapper/languageDetailsMapper';
import { AssistantAppsApiService } from '../../services/api/AssistantAppsApiService';
import { ActionButtons, SectionItem } from './guideComponents';
import { mapStateToProps } from './guidListPage.Redux';

interface IWithDepInj {
    assistantAppsApiService: AssistantAppsApiService;
}
interface IWithoutDepInj {
    location: any;
    match: any;
    history: any;
}
interface IFromRedux {
    userGuid: string;
}

interface IProps extends IFromRedux, IWithDepInj, IWithoutDepInj { }

export const CreateGuidePageUnconnected: React.FC<IProps> = (props: IProps) => {
    const { id: existingGuideId }: any = useParams();
    const isEditing = (existingGuideId != null && existingGuideId.length > 0);
    const history = useHistory();

    // Meta
    const [appStatus, setAppStatus] = useState<NetworkState>(NetworkState.Pending);
    const [appDropDowns, setAppDropDowns] = useState<Array<DropDownWithIcon>>([]);
    const [langStatus, setLangStatus] = useState<NetworkState>(NetworkState.Pending);
    const [langDropDowns, setLangDropDowns] = useState<Array<DropDownWithIcon>>([]);

    const [selectedSectionGuid, setSelectedSectionGuid] = useState<string>();

    // Create specific
    const [submissionStatus, setSubmissionStatus] = useState<NetworkState>(isEditing ? NetworkState.Loading : NetworkState.Pending);
    const [addGuideObj, setAddGuideObj] = useState<AddGuideViewModel>({
        appGuid: '',
        languageCode: '',

        title: '',
        subTitle: '',
        minutes: 0,
        tags: [],
        sections: [],
        showCreatedByUser: true,
    });

    const isNotLoggedIn = props.userGuid == null || props.userGuid.length < 1;

    useEffect(() => {
        if (isNotLoggedIn) return;
        fetchAppData();
        fetchLanguageData();
        fetchExistingGuide();
        // const seasIdSlashIndex = url.lastIndexOf('/');
        // const seasId = url.substring(seasIdSlashIndex + 1, url.length);
        // eslint-disable-next-line
    }, [props.userGuid]);

    const fetchAppData = async () => {
        const appsResult = await props.assistantAppsApiService.getApps();
        if (!appsResult.isSuccess) {
            setAppStatus(NetworkState.Error);
            return;
        }
        setAppDropDowns(appDetailsToAppDropDownMapper(appsResult.value));
        setAppStatus(NetworkState.Success);
    }

    const fetchLanguageData = async () => {
        const langResult = await props.assistantAppsApiService.getLanguages();
        if (!langResult.isSuccess) {
            setLangStatus(NetworkState.Error);
            return;
        }
        setLangDropDowns(languageDetailsToLanguageDropDownMapper(langResult.value));
        setLangStatus(NetworkState.Success);
    }

    const fetchExistingGuide = async () => {
        if (!isEditing) {
            if (submissionStatus === NetworkState.Loading) {
                setSubmissionStatus(NetworkState.Success);
            }
            return;
        }
        const fetchGuide = await props.assistantAppsApiService.getGuidesById(existingGuideId);
        if (fetchGuide.isSuccess === false) {
            errorDialog('Loading Guide failed', 'Could not load the selected guide.');
            return;
        }

        setAddGuideObj({
            appGuid: fetchGuide.value.appGuid,
            languageCode: fetchGuide.value.languageCode,

            title: fetchGuide.value.title,
            subTitle: fetchGuide.value.subTitle,
            minutes: fetchGuide.value.minutes,
            tags: fetchGuide.value.tags,
            sections: fetchGuide.value.sections,
            showCreatedByUser: fetchGuide.value.showCreatedByUser,
        });
        setSubmissionStatus(NetworkState.Success);
    }

    const setDetailProperty = (prop: string, value: any) => {
        setAddGuideObj({
            ...addGuideObj,
            [prop]: value,
        });
    }

    const addSection = async () => {
        const newHeading = await getStringDialog('New Section heading', '', 'Step 1...');
        if (newHeading == null || newHeading.length < 1) return;
        const newSection: GuideSectionViewModel = {
            guid: newGuid(),
            heading: newHeading,
            sortOrder: addGuideObj.sections.length,
            items: [],
        };
        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...addGuideObj.sections,
                newSection,
            ],
        });
    }

    const editSectionHeading = (sectionId: string) => async () => {
        if (sectionId == null || sectionId.length < 1) return;

        const selectedItemIndex = addGuideObj.sections
            .findIndex((sec: GuideSectionViewModel) => sec.guid === sectionId);
        if (selectedItemIndex < 0) return;

        const selectedItem: GuideSectionViewModel = addGuideObj.sections[selectedItemIndex];
        if (selectedItem == null) return;

        const newHeading = await getStringDialog('New Section heading', selectedItem.heading);
        if (newHeading == null || newHeading.length < 1) return;

        const editFunc = editSectionDetails(sectionId)
        editFunc('heading', newHeading);
    }

    const editSectionDetails = (sectionId: string) => async (name: string, value: string) => {
        if (sectionId == null || sectionId.length < 1) return;

        const selectedSectionIndex = addGuideObj.sections
            .findIndex((sec: GuideSectionViewModel) => sec.guid === sectionId);
        if (selectedSectionIndex < 0) return;

        const selectedSection: GuideSectionViewModel = addGuideObj.sections[selectedSectionIndex];
        if (selectedSection == null) return;

        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...addGuideObj.sections.slice(0, selectedSectionIndex),
                { ...selectedSection, [name]: value },
                ...addGuideObj.sections.slice(selectedSectionIndex + 1)
            ],
        });
    }

    const moveSection = (sectionId: string) => (moveDown: boolean) => {
        if (sectionId == null || sectionId.length < 1) return;

        const selectedSectionIndex = addGuideObj.sections
            .findIndex((sec: GuideSectionViewModel) => sec.guid === sectionId);
        if (selectedSectionIndex < 0) return;

        const swapIndex = moveDown ? (selectedSectionIndex + 1) : (selectedSectionIndex - 1);
        const tempItems = [...addGuideObj.sections];
        const tempItem = { ...tempItems[selectedSectionIndex] };
        tempItems[selectedSectionIndex] = { ...tempItems[swapIndex], sortOrder: tempItem.sortOrder };
        tempItems[swapIndex] = { ...tempItem, sortOrder: tempItems[swapIndex].sortOrder };

        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...tempItems,
            ],
        });
    }

    const deleteSection = (sectionId: string) => () => {
        if (sectionId == null || sectionId.length < 1) return;

        const selectedSectionIndex = addGuideObj.sections
            .findIndex((sec: GuideSectionViewModel) => sec.guid === sectionId);
        if (selectedSectionIndex < 0) return;

        const selectedSection: GuideSectionViewModel = addGuideObj.sections[selectedSectionIndex];
        if (selectedSection == null) return;

        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...addGuideObj.sections.slice(0, selectedSectionIndex),
                ...addGuideObj.sections.slice(selectedSectionIndex + 1)
            ],
        });
    }

    const addSectionItem = (sectionId: string, type: GuideSectionItemType) => () => {
        if (sectionId == null || sectionId.length < 1) return;

        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...addGuideObj.sections.map((sec: GuideSectionViewModel) => {
                    if (sec.guid !== sectionId) return sec;

                    const newSectionItem: GuideSectionItemViewModel = {
                        guid: newGuid(),
                        type: type,
                        sortOrder: sec.items.length,
                        content: '',
                        additionalContent: '',
                        tableColumnNames: [],
                        tableData: [],
                    };
                    (newSectionItem as any).isNew = true;

                    return {
                        ...sec,
                        items: [
                            ...sec.items,
                            newSectionItem
                        ]
                    }
                }),
            ],
        });
        setSelectedSectionGuid(undefined);
    }

    const editSectionItemDetails = (sectionId: string) => async (sectionItemId: string, name: string, value: string) => {
        if (sectionId == null || sectionId.length < 1) return;
        if (sectionItemId == null || sectionItemId.length < 1) return;

        const selectedSectionIndex = addGuideObj.sections
            .findIndex((sec: GuideSectionViewModel) => sec.guid === sectionId);
        if (selectedSectionIndex < 0) return;

        const selectedSection: GuideSectionViewModel = addGuideObj.sections[selectedSectionIndex];
        if (selectedSection == null) return;

        const selectedItemIndex = selectedSection.items
            .findIndex((secItem: GuideSectionItemViewModel) => secItem.guid === sectionItemId);
        if (selectedItemIndex < 0) return;

        const selectedItem: GuideSectionItemViewModel = selectedSection.items[selectedItemIndex];
        if (selectedItem == null) return;

        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...addGuideObj.sections.slice(0, selectedSectionIndex),
                {
                    ...selectedSection, items: [
                        ...selectedSection.items.slice(0, selectedItemIndex),
                        { ...selectedItem, [name]: value, isNew: false, },
                        ...selectedSection.items.slice(selectedItemIndex + 1)
                    ]
                },
                ...addGuideObj.sections.slice(selectedSectionIndex + 1)
            ],
        });
    }

    const moveSectionItem = (sectionId: string) => (sectionItemId: string, moveDown: boolean) => {
        if (sectionId == null || sectionId.length < 1) return;
        if (sectionItemId == null || sectionItemId.length < 1) return;

        const selectedSectionIndex = addGuideObj.sections
            .findIndex((sec: GuideSectionViewModel) => sec.guid === sectionId);
        if (selectedSectionIndex < 0) return;

        const selectedSection: GuideSectionViewModel = addGuideObj.sections[selectedSectionIndex];
        if (selectedSection == null) return;

        const selectedItemIndex = selectedSection.items
            .findIndex((secItem: GuideSectionItemViewModel) => secItem.guid === sectionItemId);
        if (selectedItemIndex < 0) return;

        const selectedItem: GuideSectionItemViewModel = selectedSection.items[selectedItemIndex];
        if (selectedItem == null) return;

        const swapIndex = moveDown ? (selectedItemIndex + 1) : (selectedItemIndex - 1);
        const tempItems = [...selectedSection.items];
        const tempItem = { ...tempItems[selectedItemIndex] };
        tempItems[selectedItemIndex] = { ...tempItems[swapIndex], sortOrder: tempItem.sortOrder };
        tempItems[swapIndex] = { ...tempItem, sortOrder: tempItems[swapIndex].sortOrder };

        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...addGuideObj.sections.slice(0, selectedSectionIndex),
                {
                    ...selectedSection, items: [
                        ...tempItems
                    ]
                },
                ...addGuideObj.sections.slice(selectedSectionIndex + 1)
            ],
        });
    }

    const deleteSectionItem = (sectionId: string) => (sectionItemId: string) => {
        if (sectionId == null || sectionId.length < 1) return;
        if (sectionItemId == null || sectionItemId.length < 1) return;

        const selectedSectionIndex = addGuideObj.sections
            .findIndex((sec: GuideSectionViewModel) => sec.guid === sectionId);
        if (selectedSectionIndex < 0) return;

        const selectedSection: GuideSectionViewModel = addGuideObj.sections[selectedSectionIndex];
        if (selectedSection == null) return;

        const selectedItemIndex = selectedSection.items
            .findIndex((secItem: GuideSectionItemViewModel) => secItem.guid === sectionItemId);
        if (selectedItemIndex < 0) return;

        const selectedItem: GuideSectionItemViewModel = selectedSection.items[selectedItemIndex];
        if (selectedItem == null) return;

        setAddGuideObj({
            ...addGuideObj,
            sections: [
                ...addGuideObj.sections.slice(0, selectedSectionIndex),
                {
                    ...selectedSection, items: [
                        ...selectedSection.items.slice(0, selectedItemIndex),
                        ...selectedSection.items.slice(selectedItemIndex + 1)
                    ]
                },
                ...addGuideObj.sections.slice(selectedSectionIndex + 1)
            ],
        });
    }

    const submitGuide = async () => {
        setSubmissionStatus(NetworkState.Loading);

        if (isEditing === false) {
            const addResult = await props.assistantAppsApiService.submitGuide(addGuideObj);
            if (addResult.isSuccess === false) {
                errorDialog('Submission failed', 'Could not submit your guide. ' + addResult.errorMessage);
                setSubmissionStatus(NetworkState.Error);
                return;
            }
            successDialog('Success', 'Your guide has been submitted!');
        } else {
            const editResult = await props.assistantAppsApiService.editGuide(existingGuideId, addGuideObj);
            if (editResult.isSuccess === false) {
                errorDialog('Edit failed', 'Could not edit your guide. ' + editResult.errorMessage);
                setSubmissionStatus(NetworkState.Error);
                return;
            }
            successDialog('Success', 'Your guide has been editted!');
        }
        setSubmissionStatus(NetworkState.Success);
        history.push(guides);
    }

    const banner = (
        <SmallBanner
            title="Create a Guide"
            descrip="Tool for creating and editing Guides for the the Assistant Apps"
        />
    );

    if (isNotLoggedIn) {
        return (
            <>
                {banner}
                <div className="container">
                    <div className="row full pt3 pb3">
                        <LoginRequired />
                    </div>
                </div>
            </>
        );
    }

    const renderSectionItems = (sectionId: string, sectionItems: Array<GuideSectionItemViewModel>) => {
        const orderedSectionItems = (sectionItems ?? []).sort((a: GuideSectionItemViewModel, b: GuideSectionItemViewModel) => a.sortOrder - b.sortOrder);
        return (
            <>
                {
                    orderedSectionItems.map((sectionItem: GuideSectionItemViewModel, index: number) => (
                        <div key={`container-${sectionItem.guid}-${index}`} className="col-12 pt1">
                            <SectionItem
                                key={`${sectionItem.guid}-${index}`}
                                index={index}
                                totalLength={orderedSectionItems.length}
                                item={sectionItem}
                                saveItem={editSectionItemDetails(sectionId)}
                                moveItem={moveSectionItem(sectionId)}
                                deleteItem={deleteSectionItem(sectionId)}
                            />
                        </div>
                    ))
                }
            </>
        );
    }

    const renderSections = (sections: Array<GuideSectionViewModel>) => {
        const orderedSections = sections.sort((a: GuideSectionViewModel, b: GuideSectionViewModel) => a.sortOrder - b.sortOrder);
        return (
            <>
                {
                    orderedSections.map((section: GuideSectionViewModel, index: number) => (
                        <div key={`${section.guid}-${index}-${section.items.map(si => si.guid).join(',')}`} className="col-12 pt1">
                            <span className="pointer" onClick={editSectionHeading(section.guid)}>
                                <h3 style={{ display: 'inline' }}>{section.heading}&nbsp;&nbsp;&nbsp;</h3>
                                <Popup wide
                                    content="Edit heading"
                                    trigger={<Icon name="edit" />}
                                />
                            </span>

                            <div className="row">
                                {renderSectionItems(section.guid, section.items)}
                            </div>

                            <div className="row">
                                <div className="col-12 pt1">
                                    <button className="button mt1" onClick={() => setSelectedSectionGuid(section.guid)}>Add item</button>
                                </div>
                            </div>

                            <ActionButtons
                                index={index}
                                additionalClassName="pt1"
                                totalLength={orderedSections.length}
                                saveItem={editSectionDetails(section.guid)}
                                moveItem={moveSection(section.guid)}
                                deleteItem={deleteSection(section.guid)}
                            />

                            <div className="row"><div className="col-12 pt2"><hr /></div></div>
                        </div>
                    ))
                }
            </>
        );
    }

    // console.log({ ...addGuideObj });

    const firstInvalidSection = (addGuideObj.sections as Array<GuideSectionViewModel>)
        .find((s: GuideSectionViewModel) => s.items.length < 1);
    const submitDisabled =
        (addGuideObj.appGuid == null) ||
        (addGuideObj.appGuid.length < 1) ||
        (addGuideObj.languageCode == null) ||
        (addGuideObj.languageCode.length < 1) ||
        (addGuideObj.sections == null) ||
        (addGuideObj.sections.length < 1) ||
        (firstInvalidSection != null);

    return (
        <>
            {banner}
            {
                (submissionStatus === NetworkState.Error) &&
                <Error message="Something went wrong submitting your guide" />
            }
            <div className="container">
                <div className="row full pt3 pb1">
                    <div className="col-12 col-md-6">
                        <Form>
                            <Form.Field >
                                <label>Please select App you would like to create a guide for</label>
                            </Form.Field>
                        </Form>
                        {
                            (appStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder="Select Apps"
                                    options={appDropDowns}
                                    value={addGuideObj.appGuid}
                                    isLoading={appStatus === NetworkState.Loading}
                                    onChange={(app: any) => setDetailProperty('appGuid', app)}
                                />
                                : <p>Error loading apps, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-12 col-md-6 custom-drop-down pt1 pt-md-0">
                        <Form>
                            <Form.Field >
                                <label>Please select the language your guide will be written in</label>
                            </Form.Field>
                        </Form>
                        {
                            (langStatus !== NetworkState.Error)
                                ? <DropDown
                                    placeholder="Select Language"
                                    options={langDropDowns}
                                    value={addGuideObj.languageCode}
                                    isLoading={langStatus === NetworkState.Loading}
                                    onChange={(app: any) => setDetailProperty('languageCode', app)}
                                />
                                : <p>Error loading languages, please refresh the page or contact us</p>
                        }
                    </div>
                    <div className="col-12 col-md-12">
                        <Form>
                            <Form.Group>
                                <Form.Field width="6" className="pt1">
                                    <label>Title</label>
                                    <Input
                                        placeholder="How to..."
                                        defaultValue={addGuideObj.title}
                                        onChange={(_: any, data: InputOnChangeData) => setDetailProperty('title', data.value)}
                                    />
                                </Form.Field>
                                <Form.Field width="10" className="pt1">
                                    <label>Subtitle</label>
                                    <Input
                                        placeholder="This guide will help you..."
                                        defaultValue={addGuideObj.subTitle}
                                        onChange={(_: any, data: InputOnChangeData) => setDetailProperty('subTitle', data.value)}
                                    />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group>
                                <Form.Field width="12" className="pt1 pt-md-0">
                                    <label>Tags</label>
                                    <TagsFormInput
                                        existingTags={addGuideObj.tags}
                                        setTags={(tags: Array<string>) => setDetailProperty('tags', tags)}
                                    />
                                </Form.Field>
                                <Form.Field width="4" className="pt1 pt-md-0">
                                    <label>How long is your guide</label>
                                    <Input
                                        placeholder="5" type="number" fluid={true}
                                        label={{ basic: true, content: 'minutes' }}
                                        labelPosition="right"
                                        defaultValue={addGuideObj.minutes}
                                        onChange={(_: any, data: InputOnChangeData) => setDetailProperty('minutes', data.value)}
                                    />
                                </Form.Field>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
                <hr />
                <div className="row full pb2">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                {
                                    ((addGuideObj.sections ?? []).length < 1) &&
                                    (<h3 className="ta-center pt1">No sections added yet</h3>)
                                }
                            </div>
                            {renderSections([...addGuideObj.sections])}
                        </div>
                    </div>
                    <div className="col-12 pt1 ta-center">
                        <button className="button mt1" onClick={addSection}>Add Section</button>
                    </div>
                </div>
                <hr />
                <div className="row full pb3">
                    <div className="col-12 ta-center pb1">
                        <ConditionalToolTip
                            message="Must choose an App, a Language, add at least one section and add add an item to it."
                            showToolTip={submitDisabled}>
                            <button className={classNames("button full submit_btn mt1", { disabled: submitDisabled })}
                                onClick={() => !submitDisabled && submitGuide()}>
                                <span>Submit Guide</span>
                            </button>
                        </ConditionalToolTip>
                    </div>
                </div>
            </div>
            <BaseDialog
                isOpen={selectedSectionGuid != null}
                closeModal={() => setSelectedSectionGuid(undefined)}
            >
                <div className="row justify">
                    <AddTextSection onClick={addSectionItem(selectedSectionGuid!, GuideSectionItemType.text)} />
                    <AddLinkSection onClick={addSectionItem(selectedSectionGuid!, GuideSectionItemType.link)} />
                    <AddImageSection onClick={addSectionItem(selectedSectionGuid!, GuideSectionItemType.image)} />
                    <AddMarkdownSection onClick={addSectionItem(selectedSectionGuid!, GuideSectionItemType.markdown)} />
                </div>
            </BaseDialog>
            {
                (submissionStatus === NetworkState.Loading) &&
                <Loading />
            }
        </>
    );
};

export const CreateGuidePage = withServices<IWithoutDepInj, IWithDepInj>(
    connect(mapStateToProps)(CreateGuidePageUnconnected),
    (services: IDependencyInjection) => ({
        assistantAppsApiService: services.assistantAppsApiService,
    })
);
