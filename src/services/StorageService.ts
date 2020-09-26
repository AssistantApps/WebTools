import moment from 'moment';
import { ResultWithValue } from '../contracts/results/ResultWithValue';
import { StorageItem } from '../contracts/storageItem';
import { anyObject } from '../helper/typescriptHacks';

export class StorageService {
    public get<T>(key: string): ResultWithValue<T> {
        const itemString = localStorage.getItem(key) || '{}';
        const item: StorageItem<T> = JSON.parse(itemString);

        if (item != null && item.data != null && item.expiryDate != null) {
            if (moment(item.expiryDate).isAfter(moment())) {
                return {
                    isSuccess: true,
                    value: item.data,
                    errorMessage: '',
                }
            }
        }

        return {
            isSuccess: false,
            value: anyObject,
            errorMessage: 'could not load item from strage',
        }
    }

    public set<T>(key: string, data: T, expiry?: Date): void {
        var oneHourFromNow = moment().add(1, 'hour');

        const item: StorageItem<T> = {
            data: data,
            expiryDate: expiry || oneHourFromNow.toDate()
        };

        localStorage.setItem(key, JSON.stringify(item));
    }
}
