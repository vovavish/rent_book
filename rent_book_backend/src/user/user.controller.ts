import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetCurrentUserId } from '../common/decorators';
import { AtGuard } from '../common/guards';
import {
  UpdateUserProfileDto,
  UpdatePhoneNumbersDto,
  UpdateCardNumbersDto,
} from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AtGuard)
  @Get('profile')
  async getProfile(@GetCurrentUserId() userId: number) {
    return this.userService.getUserProfile(userId);
  }

  @UseGuards(AtGuard)
  @Patch('update')
  async updateProfile(
    @GetCurrentUserId() userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(userId, updateUserProfileDto);
  }

  @UseGuards(AtGuard)
  @Patch('update_phone_numbers')
  async updatePhoneNumbers(
    @GetCurrentUserId() userId: number,
    @Body() updatePhoneNumbersDto: UpdatePhoneNumbersDto,
  ) {
    return this.userService.updatePhoneNumbers(
      userId,
      updatePhoneNumbersDto.phoneNumbers,
    );
  }

  @UseGuards(AtGuard)
  @Patch('update_card_numbers')
  async updateCardNumbers(
    @GetCurrentUserId() userId: number,
    @Body() updateCardNumbersDto: UpdateCardNumbersDto,
  ) {
    return this.userService.updateCardNumbers(
      userId,
      updateCardNumbersDto.cardNumbers,
    );
  }
}