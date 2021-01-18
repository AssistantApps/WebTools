export const wait = (ms: number): Promise<any> => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}