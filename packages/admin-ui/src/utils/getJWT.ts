import Cookies from 'js-cookie';
import { Role } from '../__generated__/globalTypes';

interface JWTPayload {
  userId?: string;
  role?: Role;
}

export const getJWT = (): JWTPayload => {
  try {
    const authCookie = Cookies.get('PARTIAL_JWT') || '';
    const payload = JSON.parse(window.atob(authCookie.split('.')[1]));
    return payload;
  } catch (err) {
    return {};
  }
};
