export enum BookComplain {
  INCORRECT_INFORMATION = 'INCORRECT_INFORMATION',
  COPYRIGHT_VIOLATION = 'COPYRIGHT_VIOLATION',
  OFFENSIVE_CONTENT = 'OFFENSIVE_CONTENT',
  FRAUD_OR_SUSPICIOUS_BEHAVIOR = 'FRAUD_OR_SUSPICIOUS_BEHAVIOR',
  SPAM_OR_ADVERTISING = 'SPAM_OR_ADVERTISING',
  DUPLICATE_LISTING = 'DUPLICATE_LISTING',
  PROHIBITED_ITEM = 'PROHIBITED_ITEM',
  SEXUAL_OR_INAPPROPRIATE_CONTENT = 'SEXUAL_OR_INAPPROPRIATE_CONTENT',
  ANOTHER = 'ANOTHER',
}

export const BookComplainTranslations: Record<BookComplain, string> = {
  [BookComplain.INCORRECT_INFORMATION]: 'Неверная информация',
  [BookComplain.COPYRIGHT_VIOLATION]: 'Нарушение авторских прав',
  [BookComplain.OFFENSIVE_CONTENT]: 'Оскорбительное содержание',
  [BookComplain.FRAUD_OR_SUSPICIOUS_BEHAVIOR]: 'Мошенничество / подозрительное поведение',
  [BookComplain.SPAM_OR_ADVERTISING]: 'Спам / реклама',
  [BookComplain.DUPLICATE_LISTING]: 'Дублирующее объявление',
  [BookComplain.PROHIBITED_ITEM]: 'Запрещённый товар',
  [BookComplain.SEXUAL_OR_INAPPROPRIATE_CONTENT]: 'Сексуальный или неприемлемый контент',
  [BookComplain.ANOTHER]: 'Другое',
};

export interface ComplainBookDto {
  bookId: number;
  complain: BookComplain;
  message?: string;
}