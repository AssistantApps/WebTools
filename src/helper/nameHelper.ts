export const getAppNameFromImage = (currentImage: string): string => {
    if (currentImage.includes('NMS')) {
        return 'Assistant for No Man\'s Sky';
    }
    if (currentImage.includes('SMS')) {
        return 'Assistant for Scrap Mechanic';
    }
    return 'Assistant for No Man\'s Sky';
}