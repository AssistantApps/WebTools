import axios from 'axios';
import * as storageType from '../constants/storageType';
import { Result, ResultWithValue } from '../contracts/results/ResultWithValue';
import { anyObject } from '../helper/typescriptHacks';
import { StorageService } from './StorageService';


declare global {
  interface Window { config: any }
}

export class BaseApiService {
  private _baseUrl: String = window.config.apiUrl;

  constructor(newBaseUrl?: String) {
    if (newBaseUrl != null) this._baseUrl = newBaseUrl;

    try {
      const storageServ = new StorageService();
      const tokenFromStorage = storageServ.get<string>(storageType.token);
      if (tokenFromStorage.isSuccess) this.setInterceptors(tokenFromStorage.value);
    } catch (ex) { }
  }

  setInterceptors = (token: string) => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  };

  protected async get<T>(url: string): Promise<ResultWithValue<T>> {
    try {
      const result = await axios.get<T>(`${this._baseUrl}/${url}`);
      return {
        isSuccess: true,
        value: result.data,
        errorMessage: ''
      }
    } catch (ex) {
      return {
        isSuccess: false,
        value: anyObject,
        errorMessage: ex.message
      }
    }
  }

  protected async post<T>(url: string, data: any, manipulateHeaders?: (headers: any) => void): Promise<ResultWithValue<T>> {
    try {
      const result = await axios.post<T>(`${this._baseUrl}/${url}`, data);
      if (manipulateHeaders != null) manipulateHeaders(result.headers);
      return {
        isSuccess: true,
        // statusCode: result.status,
        value: result.data,
        errorMessage: ''
      }
    } catch (ex) {
      return {
        isSuccess: false,
        value: anyObject,
        statusCode: ex.response.status,
        errorMessage: ex.message
      }
    }
  }

  protected async delete(url: string, manipulateHeaders?: (headers: any) => void): Promise<Result> {
    try {
      const result = await axios.delete(`${this._baseUrl}/${url}`);
      if (manipulateHeaders != null) manipulateHeaders(result.headers);
      return {
        isSuccess: true,
        errorMessage: ''
      }
    } catch (ex) {
      return {
        isSuccess: false,
        errorMessage: ex.message
      }
    }
  }
}
