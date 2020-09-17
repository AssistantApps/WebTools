import { ResultWithValue } from '../contracts/results/ResultWithValue';
import { StorageItem } from '../contracts/storageItem';
import { anyObject } from '../helper/typescriptHacks';

const reactLocalStorage = require('reactjs-localstorage');

export class StorageService {
    public get<T>(key: string): ResultWithValue<T> {
        const item: StorageItem<T> = reactLocalStorage.get(key);

        if (item == null || item.data == null || item.expiryDate == null || item.expiryDate.getTime() < (new Date()).getTime()) {
            return {
                isSuccess: false,
                value: anyObject,
                errorMessage: 'could not load item from strage',
            }
        }

        return {
            isSuccess: true,
            value: item.data,
            errorMessage: '',
        }
    }

    public set<T>(key: string, data: T, expiry?: Date): void {
        var oneHourFromNow = new Date();
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
        const item: StorageItem<T> = {
            data: data,
            expiryDate: expiry || oneHourFromNow
        };

        reactLocalStorage.set(key, item);
    }
}
