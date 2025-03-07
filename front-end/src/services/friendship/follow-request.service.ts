import { ResponseEnum } from '../../enums/follow-request-status.enum';
import { UrlConstants } from '../../constants/url.constants';
import apiStore from '../../store/api.store';

export default class FollowRequestService {
  private static host = UrlConstants.friendship_backend;

  static async createFollowRequest(
    requestBy: string,
    requestTo: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .post(`${this.host}/friendship/follow-request`, {
          requestBy,
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

  static async revokeRequest(
    requestBy: string,
    requestTo: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .delete(`${this.host}/friendship/follow-request`, {
          params: {
            requestBy,
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

  static async getFollowRequests(userId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .get(`${this.host}/friendship/follow-request/${userId}`)
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
