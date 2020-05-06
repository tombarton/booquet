import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PasswordService } from './password.service';
import { UpdateUserInput } from '../resolvers/user/dto/update-user.input';
import { ChangePasswordInput } from '../resolvers/user/dto/change-password.input';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  // async addCartItem(userId: number) {
  //   await this.prisma.cartItem.create({
  //     data: {
  //       product: {
  //         connect: { id: '1' },
  //       },
  //       quantity: 1,
  //       cart: {}
  //     },
  //   });
  // }

  async getCartItems(userId: string) {
    return await this.prisma.cart.findOne({
      where: {
        userId,
      },
      include: {
        CartItems: true,
      },
    });
  }
}
