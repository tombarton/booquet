import { Role } from '@common/models/user';

export interface JwtDto {
  userId: string;
  role: Role;
}
