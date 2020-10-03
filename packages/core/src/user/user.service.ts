import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService, PasswordService } from '@common/services';
import { UpdateUserInput } from './dto/update-user.input';
import { ChangePasswordInput } from './dto/change-password.input';
import { User } from '@common/models/user';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async updateUser(userId: string, newUserData: UpdateUserInput) {
    return await this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async changePassword(user: User, changePassword: ChangePasswordInput) {
    // Authenticate user before proceeding.
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      user.password
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Hash new password and update user.
    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return await this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: user.id },
    });
  }

  async getCartItems(userId: string) {
    return await this.prisma.cart.findOne({
      where: { userId },
      include: { CartItems: true },
    });
  }
}
