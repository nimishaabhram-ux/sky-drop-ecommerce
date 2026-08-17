import { fetchApi } from './api';
import { User } from '../types';

export const userApi = {
  getMe: () => {
    return fetchApi<User>('/auth/me');
  }
};
