import { AddOrEditGuideViewModel, GuideSectionItemViewModel, GuideSectionViewModel } from '@assistantapps/assistantapps.api.client';
import React from 'react';
import { SectionItem } from './guideComponents';


interface IProps {
    addGuideObj: AddOrEditGuideViewModel;
    section: GuideSectionViewModel;
    setAddGuideObj: (vm: AddOrEditGuideViewModel) => void;
}

export const CreateGuideSectionItems: React.FC<IProps> = (props: IProps) => {
    const {
        addGuideObj,
        section,
        setAddGuideObj,
    } = props;

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

    const items = section.items ?? [];
    if (items.length < 1) {
        return (
            <div className="row full pb2">
                <div className="col-12">
                    <h3 className="ta-center pt1">No items added yet</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {renderSectionItems(section.guid, items)}
        </div>
    );
};
