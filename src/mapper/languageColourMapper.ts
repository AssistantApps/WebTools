const languageColourMap: any = {
    'en': '#2E52B2',
    'de': '#000000',
    'pt-br': '#6DA544',
    'ru': '#0052B4',
    'es': '#FFDA44',
    'pl': '#D80027',
    'it': '#6DA544',
    'fr': '#0052B4',
    'tr': '#d80027',
    'id': '#A2001D',
    'hu': '#6DA544',
};

export const getColourFromLanguageCode = (langCode: string) => {
    if (languageColourMap[langCode] != null) {
        return languageColourMap[langCode];
    }

    return '#3ad7ec';
}