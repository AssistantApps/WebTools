import { ResultWithValue } from '../contracts/results/ResultWithValue';
import { StorageItem } from '../contracts/storageItem';
import { isInTheFuture, oneHourFromNow } from '../helper/dateHelper';
import { anyObject } from '../helper/typescriptHacks';

export class StorageService {
    public get<T>(key: string): ResultWithValue<T> {
        const itemString = localStorage.getItem(key) || '{}';
        const item: StorageItem<T> = JSON.parse(itemString);

        if (item != null && item.data != null && item.expiryDate != null) {
            if (isInTheFuture(item.expiryDate)) {
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
        const oneHourFromNw = oneHourFromNow();

        const item: StorageItem<T> = {
            data: data,
            expiryDate: expiry || oneHourFromNw
        };

        localStorage.setItem(key, JSON.stringify(item));
    }
}
