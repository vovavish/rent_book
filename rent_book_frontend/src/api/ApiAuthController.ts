import { AuthResponse } from "../types/response/authResponse";
import { api } from './index';

export default class ApiAuthController {
  static async signUp(email: string, name: string, lastname: string, surname: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/local/signup', { email, name, lastname, surname, password })
      .then(res => res.data);
  }

  static async signIn(email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/local/signin', { email, password })
      .then(res => res.data);
  }

  static async logout(): Promise<any> {
    return api.post('/auth/logout');
  }

  static async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return api.post('/auth/local/changepassword', { oldPassword, newPassword });
  }
}