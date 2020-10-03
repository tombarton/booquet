import { JwtStrategy, AUTH_HEADER, TOKEN_RGX } from './jwt.strategy';
import { OptionalStrategy } from './optional.strategy';
import { RefreshStrategy } from './refresh.strategy';

export {
  JwtStrategy,
  OptionalStrategy,
  RefreshStrategy,
  AUTH_HEADER,
  TOKEN_RGX,
};
export const Strategies = [JwtStrategy, OptionalStrategy, RefreshStrategy];
