import { Role } from '@prisma/client';

export interface JwtDto {
  userId: string;
  role: Role;
}
