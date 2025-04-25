import { api } from './index';
import { 
  UserProfileResponse, 
  UpdateProfileResponse,
  UpdatePhoneNumbersResponse,
  UpdateCardNumbersResponse,
  UpdateUserProfileDto, 
  UpdatePhoneNumbersDto, 
  UpdateCardNumbersDto 
} from '../types/response/userResponse';

export default class ApiUserController {
  static async getProfile(): Promise<UserProfileResponse> {
    return api.get<UserProfileResponse>('/user/profile')
      .then(res => res.data);
  }

  static async updateProfile(
    updateUserProfileDto: UpdateUserProfileDto
  ): Promise<UpdateProfileResponse> {
    return api.patch<UpdateProfileResponse>('/user/update', updateUserProfileDto)
      .then(res => res.data);
  }

  static async updatePhoneNumbers(
    updatePhoneNumbersDto: UpdatePhoneNumbersDto
  ): Promise<UpdatePhoneNumbersResponse> {
    return api.patch<UpdatePhoneNumbersResponse>('/user/update_phone_numbers', updatePhoneNumbersDto)
      .then(res => res.data);
  }

  static async updateCardNumbers(
    updateCardNumbersDto: UpdateCardNumbersDto
  ): Promise<UpdateCardNumbersResponse> {
    return api.patch<UpdateCardNumbersResponse>('/user/update_card_numbers', updateCardNumbersDto)
      .then(res => res.data);
  }
}