import { UrlConstants } from '../../constants/url.constants';
import apiStore from '../../store/api.store';

export default class AuthService {
  private static host = UrlConstants.auth_backend;

  static async performLogin(email: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithoutAuthentication()
        .post(`${this.host}/auth/login`, { email, password })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.message || 'Login failed');
        });
    });
  }

  static async performSignup(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithoutAuthentication()
        .post(`${this.host}/auth/signup`, {
          firstName,
          lastName,
          email,
          password,
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.message || 'Signup failed');
        });
    });
  }

  static async getProfile(): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .get(`${this.host}/auth/me`)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.message || 'Failed to fetch profile');
        });
    });
  }

  static async fetchUsers(searchQuery?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .get(`${this.host}/auth/all-users`, {
          params: searchQuery ? { searchString: searchQuery } : {},
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.message || 'Failed to fetch users');
        });
    });
  }

  static async getUserDetailsById(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .get(`${this.host}/auth/user/${userId}`)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.message || 'Failed to fetch user profile');
        });
    });
  }

  static async updatePrivacySettings(isPrivate: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .patch(`${this.host}/auth/privacy`, { isPrivate })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.message || 'Failed to update privacy settings');
        });
    });
  }
}
