import axios, { AxiosInstance } from 'axios';

class ApiStore {
  private sessionId: string | null = null;

  constructor() {
    this.refreshSessionId();
  }

  private refreshSessionId() {
    this.sessionId = Math.random().toString(36).substring(2, 15);
  }

  getApiClientWithoutAuthentication(): AxiosInstance {
    if (!this.sessionId) this.refreshSessionId();
    const client = axios.create({
      headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
        'Session-id': this.sessionId,
        'Request-id': Math.random().toString(36).substring(2, 12),
      },
    });

    return client;
  }

  getApiClientWithAuthentication = (): AxiosInstance => {
    if (!this.sessionId) this.refreshSessionId();

    const client = axios.create();
    client.defaults.headers.common['Accept'] = 'application/json';
    client.defaults.headers.common['Content-type'] = 'application/json';
    client.defaults.headers.common['Session-id'] = this.sessionId;
    client.defaults.headers.common['Request-id'] = Math.random()
      .toString(36)
      .substring(2, 12);

    const token = localStorage.getItem('accessToken');

    if (token) {
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn('No access token found, request may fail');
    }

    return client;
  };
}

export default new ApiStore();
