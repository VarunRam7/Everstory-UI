import { ResponseEnum } from '../../enums/follow-request-status.enum';
import { UrlConstants } from '../../constants/url.constants';
import apiStore from '../../store/api.store';

export default class FollowRequestService {
  private static host = UrlConstants.friendship_backend;

  static async createFollowRequest(requestTo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .post(`${this.host}/friendship/follow-request`, {
          requestTo,
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.response?.data?.message || 'Follow request failed');
        });
    });
  }

  static async revokeRequest(requestTo: string): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .delete(`${this.host}/friendship/follow-request`, {
          params: {
            requestTo,
          },
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(error?.response?.data?.message || 'Follow request failed');
        });
    });
  }

  static async getFollowRequests(): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .get(`${this.host}/friendship/follow-request`)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(
            error?.response?.data?.message || 'Failed to fetch follow requests'
          );
        });
    });
  }

  static async respondToRequest(
    requestToken: string,
    status: ResponseEnum
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .patch(`${this.host}/friendship/follow-request/respond`, {
          requestToken,
          status,
          isExpired: true,
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch((error: any) => {
          reject(
            error?.response?.data?.message || 'Failed to respond to invite'
          );
        });
    });
  }
}
