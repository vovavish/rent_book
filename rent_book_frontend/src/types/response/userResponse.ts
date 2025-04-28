
export interface UserProfileResponse {
  id: number;
  name: string;
  lastname: string;
  surname?: string;
  email: string;
  phoneNumbers: string[];
  cardNumbers: string[];
  roles: string[];
  ownerRating: number;
  readerRating: number;
  createdAt: Date,
  updatedAt: Date,
}

export interface UpdateProfileResponse {
  id: number;
  name: string;
  lastname: string;
  surname?: string;
  email: string;
  phoneNumbers: string[];
  cardNumbers: string[];
  updatedAt: Date,
}

export interface UpdatePhoneNumbersResponse {
  id: number;
  phoneNumbers: string[];
  updatedAt: Date,
}

export interface UpdateCardNumbersResponse {
  id: number;
  cardNumbers: string[];
  updatedAt: Date,
}

// Для обновления основной информации
export interface UpdateUserProfileDto {
  name?: string;
  lastname?: string;
  surname?: string;
}

// Для обновления телефонов
export interface UpdatePhoneNumbersDto {
  phoneNumbers: string[];
}

export interface UpdateCardNumbersDto {
  cardNumbers: string[];
}