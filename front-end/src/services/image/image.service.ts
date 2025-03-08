import { UrlConstants } from '../../constants/url.constants';
import apiStore from '../../store/api.store';

export default class ImageService {
  private static host = UrlConstants.image_backend;

  static async uploadProfilePhoto(file: File, email: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('email', email);

      apiStore
        .getApiClientWithAuthentication()
        .post(`${this.host}/image/upload-profile-photo`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response: any) => {
          if (!response?.data?.url) {
            throw new Error('Image upload failed: No URL received');
          }

          resolve(response.data.url);
        })
        .catch((error: any) => {
          console.error('Profile photo upload error:', error);
          reject(
            error?.response?.data?.message || 'Profile photo upload failed'
          );
        });
    });
  }

  static async removeProfilePhoto(
    profileImageUrl: string,
    email: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .delete(`${this.host}/image/remove-profile-photo`, {
          data: { profileImageUrl, email },
        })
        .then((response) => {
          resolve(response.data.message);
        })
        .catch((error: any) => {
          reject(
            error?.response?.data?.message || 'Profile photo removal failed'
          );
        });
    });
  }

  static async uploadPost(
    file: File,
    userId: string,
    caption?: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('caption', caption || '');

      apiStore
        .getApiClientWithAuthentication()
        .post(`${this.host}/image/upload-post`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response: any) => {
          if (!response?.data?.url) {
            throw new Error('Image upload failed: No URL received');
          }

          resolve(response.data.url);
        })
        .catch((error: any) => {
          console.error('Post upload error:', error);
          reject(error?.response?.data?.message || 'Post upload failed');
        });
    });
  }

  static async getMyPosts(
    userId: string,
    page: number = 1,
    pageSize: number = 6
  ): Promise<any> {
    return apiStore
      .getApiClientWithAuthentication()
      .get(`${this.host}/image/my-posts`, {
        params: { userId, page, pageSize },
      })
      .then((response: any) => {
        if (!response?.data?.posts) throw new Error('No posts received');
        return response.data;
      })
      .catch((error: any) => {
        throw error?.response?.data?.message || 'Failed to fetch posts';
      });
  }

  static async getHomeFeed(
    userId: string,
    page: number = 1,
    pageSize: number = 6
  ): Promise<any> {
    return apiStore
      .getApiClientWithAuthentication()
      .get(`${this.host}/image/home`, {
        params: { userId, page, pageSize },
      })
      .then((response: any) => {
        if (!response?.data?.posts)
          throw new Error('No posts to be shown in home feed');
        return response.data;
      })
      .catch((error: any) => {
        throw error?.response?.data?.message || 'Failed to fetch home feed';
      });
  }

  static async deletePost(postId: string, imageUrl: string) {
    return new Promise((resolve, reject) => {
      apiStore
        .getApiClientWithAuthentication()
        .delete(`${this.host}/image/${postId}`, { data: { imageUrl } })
        .then((response) => {
          resolve(response.data.message);
        })
        .catch((error: any) => {
          reject(error?.response?.data?.message || 'Delete post failed');
        });
    });
  }
}
