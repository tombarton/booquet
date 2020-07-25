import jwtDecode from 'jwt-decode';
import { JWT } from '../types';

class AuthService {
  accessTokenName = 'ACCESS_TOKEN';

  getAccessToken() {
    return localStorage.getItem(this.accessTokenName);
  }

  setAccessToken(token: string) {
    return localStorage.setItem(this.accessTokenName, token);
  }

  removeAccessToken() {
    localStorage.removeItem(this.accessTokenName);
  }

  isValidToken(token: string) {
    if (!token) {
      return false;
    }

    const decoded: JWT = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  }

  handleAuthentication() {
    const accessToken = this.getAccessToken();

    if (this.isValidToken(accessToken || '')) {
      return accessToken;
    }
    return null;
  }
}

export default new AuthService();
