import { makeAutoObservable, runInAction } from "mobx";
import ApiUserController from "../../api/ApiUserController";
import {
  UserProfileResponse,
  UpdateUserProfileDto,
  UpdatePhoneNumbersDto,
  UpdateCardNumbersDto
} from "../../types/response/userResponse";

export class UserProfileStore {
  private _profile: UserProfileResponse | null = null;
  private _isLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get profile() {
    return this._profile;
  }

  set profile(profile: UserProfileResponse | null) {
    this._profile = profile;
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  async fetchProfile() {
    await this.handleRequest(async () => {
      const response = await ApiUserController.getProfile();
      runInAction(() => {
        this._profile = response;
      })
    }, "Failed to fetch user profile");
  }

  async updateProfile(updateData: UpdateUserProfileDto) {
    await this.handleRequest(async () => {
      const response = await ApiUserController.updateProfile(updateData);
      runInAction(() => {
        this._profile = {
          ...this._profile!,
          ...response
        };
      });
      return response;
    }, "Failed to update profile");
  }

  async updatePhoneNumbers(updateData: UpdatePhoneNumbersDto) {
    await this.handleRequest(async () => {
      const response = await ApiUserController.updatePhoneNumbers(updateData);
      runInAction(() => {
        this._profile = {
          ...this._profile!,
          phoneNumbers: response.phoneNumbers
        };
      });
      return response;
    }, "Failed to update phone numbers");
  }

  async updateCardNumbers(updateData: UpdateCardNumbersDto) {
    await this.handleRequest(async () => {
      const response = await ApiUserController.updateCardNumbers(updateData);
      runInAction(() => {
        this._profile = {
          ...this._profile!,
          cardNumbers: response.cardNumbers
        };
      });
      return response;
    }, "Failed to update card numbers");
  }

  clearError() {
    this._error = null;
  }

  private async handleRequest(requestFn: () => Promise<unknown>, errorMessage: string) {
    try {
      this._isLoading = true;
      this._error = null;
      return await requestFn();
    } catch (e) {
      console.log(e);
      runInAction(() => {
        this._error = errorMessage;
      });
      throw e;
    } finally {
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}