import { UrlConstants } from '../../constants/url.constants';
import apiStore from '../../store/api.store';

export default class RelationshipService {
  private static host = UrlConstants.friendship_backend;

  static async unfollowUser(
    requestBy: string,
    requestTo: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .delete(`${this.host}/friendship/unfollow`, {
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
}
