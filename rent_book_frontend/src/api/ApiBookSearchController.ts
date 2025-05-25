import qs from 'qs';
import { api } from './index';
import { BookResponse } from '../types/response/bookResponse';
import { BookSearchDto } from '../types/response/bookSearch';

export default class ApiBookSearchController {
  static async searchBooks(params: BookSearchDto): Promise<BookResponse[]> {
    return api.get<BookResponse[]>('/book-search', {
      params,
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    }).then(res => res.data);
  }
}
