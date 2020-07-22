import { JwtStrategy, AUTH_HEADER, TOKEN_RGX } from './jwt.strategy';
import { OptionalStrategy } from './optional.strategy';

export { JwtStrategy, OptionalStrategy, AUTH_HEADER, TOKEN_RGX };
export const Strategies = [JwtStrategy, OptionalStrategy];
