import React, { } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import { AddOrEditGuideViewModel } from '../../contracts/generated/ViewModel/Guide/addOrEditGuideViewModel';
import { GuideSectionViewModel } from '../../contracts/generated/ViewModel/Guide/guideSectionViewModel';
import { getStringDialog } from '../../helper/dialogHelper';
import { CreateGuideSectionItems } from './createGuideSectionItems';
import { ActionButtons } from './guideComponents';

interface IProps {
    addGuideObj: AddOrEditGuideViewModel;
    setAddGuideObj: (vm: AddOrEditGuideViewModel) => void;
    addSection: () => void;
    setSelectedSectionGuid: (guid: string) => void;
}

export const CreateGuideSections: React.FC<IProps> = (props: IProps) => {
    const {
        addGuideObj,
        setAddGuideObj,
        addSection,
        setSelectedSectionGuid,
    } = props;

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

    const renderSections = (sections: Array<GuideSectionViewModel>) => {
        const orderedSections = sections.sort((a: GuideSectionViewModel, b: GuideSectionViewModel) => a.sortOrder - b.sortOrder);
        return (
            <>
                {
                    orderedSections.map((section: GuideSectionViewModel, index: number) => (
                        <div key={`${section.guid}-${index}-${section.items.map(si => si.guid).join(',')}`} className="container section">
                            <div className="row">
                                <div className="col-12 pt1">
                                    <span className="pointer" onClick={editSectionHeading(section.guid)}>
                                        <h3 style={{ display: 'inline' }}>{section.heading}&nbsp;&nbsp;&nbsp;</h3>
                                        <Popup wide
                                            content="Edit heading"
                                            trigger={<Icon name="edit" />}
                                        />
                                    </span>

                                    <CreateGuideSectionItems
                                        addGuideObj={addGuideObj}
                                        section={section}
                                        setAddGuideObj={setAddGuideObj}
                                    />

                                    <div className="row">
                                        <div className="col-12 pt1">
                                            <button className="button mt1" onClick={() => setSelectedSectionGuid(section.guid)}>Add item</button>
                                        </div>
                                    </div>

                                    <ActionButtons
                                        index={index}
                                        additionalClassName="pt1"
                                        itemSpecificName="section"
                                        totalLength={orderedSections.length}
                                        saveItem={editSectionDetails(section.guid)}
                                        moveItem={moveSection(section.guid)}
                                        deleteItem={deleteSection(section.guid)}
                                    />

                                    <div className="row"><div className="col-12 pt2"><hr /></div></div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </>
        );
    }

    const sections = (addGuideObj.sections ?? []);
    if (sections.length < 1) {
        return (
            <div className="container">
                <div className="row full pb2">
                    <div className="col-12">
                        <h3 className="ta-center pt1">No sections added yet</h3>
                    </div>
                </div>
                <div className="row full pb2">
                    <div className="col-12 pt1 ta-center">
                        <button className="button mt1" onClick={addSection}>Add Section</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {renderSections([...sections])}
            <div className="container">
                <div className="col-12 pt1 ta-center">
                    <button className="button mt1" onClick={addSection}>Add Section</button>
                </div>
            </div>
        </>
    );
};
