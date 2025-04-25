import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UpdateUserProfileDto,
  UpdatePhoneNumbersDto,
  UpdateCardNumbersDto,
} from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        lastname: true,
        surname: true,
        email: true,
        phoneNumbers: true,
        cardNumbers: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUserProfile(
    userId: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: updateUserProfileDto.name,
        lastname: updateUserProfileDto.lastname,
        surname: updateUserProfileDto.surname,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        surname: true,
        email: true,
        phoneNumbers: true,
        cardNumbers: true,
        updatedAt: true,
      },
    });
  }

  async updatePhoneNumbers(userId: number, phoneNumbers: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { phoneNumbers },
      select: {
        id: true,
        phoneNumbers: true,
        updatedAt: true,
      },
    });
  }

  async updateCardNumbers(userId: number, cardNumbers: string[]) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { cardNumbers },
      select: {
        id: true,
        cardNumbers: true,
        updatedAt: true,
      },
    });
  }
}