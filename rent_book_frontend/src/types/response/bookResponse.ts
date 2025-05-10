import { IUser } from "../user";

// Enums
export enum Condition {
  NEW_EDITION = 'NewEdition',
  USED_BOOK = 'UsedBook',
  RARE_EDITION = 'RareEdition',
  ANTIQUE_BOOK = 'AntiqueBook',
  MANUSCRIPT_EDITION = 'ManuscriptEdition',
  NUMBERED_EDITION = 'NumberedEdition',
  SIGNED_EDITION = 'SignedEdition',
  SMALL_PRINT_RUN = 'SmallPrintRun',
  OFF_PRINT_RUN = 'OffPrintRun',
}

export const conditionTranslations: Record<Condition, string> = {
  [Condition.NEW_EDITION]: 'Новое издание',
  [Condition.USED_BOOK]: 'Букинистическая книга',
  [Condition.RARE_EDITION]: 'Редкое издание',
  [Condition.ANTIQUE_BOOK]: 'Антикварная книга',
  [Condition.MANUSCRIPT_EDITION]: 'Издание на правах рукописи',
  [Condition.NUMBERED_EDITION]: 'Нумерованное издание',
  [Condition.SIGNED_EDITION]: 'Подписное издание',
  [Condition.SMALL_PRINT_RUN]: 'Малотиражное издание',
  [Condition.OFF_PRINT_RUN]: 'Внетиражное издание',
};

export enum Format {
  SMALL_FORMAT = 'SmallFormat',
  POCKET_EDITION = 'PocketEdition',
  MINIATURE = 'Miniature',
  TINY_BOOK = 'TinyBook',
  FOLIO = 'Folio',
}

export const formatTranslations: Record<Format, string> = {
  [Format.SMALL_FORMAT]: 'Малоформатное издание',
  [Format.POCKET_EDITION]: 'Карманное издание',
  [Format.MINIATURE]: 'Миниатюрное издание',
  [Format.TINY_BOOK]: 'Книжка-малютка',
  [Format.FOLIO]: 'Фолиант',
};

export enum BookStatus {
  ACTIVE = 'ACTIVE',
  RENTED = 'RENTED',
  CLOSED = 'CLOSED',
}

export enum Type {
  BOOK = 'Book',
  NOTEBOOK = 'NoteBook',
  MAGAZINE = 'Magazine',
  NEWSPAPER = 'Newspaper',
  DICTIONARY = 'Dictionary',
  ENCYCLOPEDIA = 'Encyclopedia',
  REFERENCE = 'Reference',
  TEXTBOOK = 'Textbook',
  ANTHOLOGY = 'Anthology',
  SONGBOOK = 'Songbook',
  MANGA = 'Manga',
}

export const typeTranslations: Record<Type, string> = {
  [Type.BOOK]: 'Книга',
  [Type.NOTEBOOK]: 'Нотное издание',
  [Type.MAGAZINE]: 'Журнал',
  [Type.NEWSPAPER]: 'Газета',
  [Type.DICTIONARY]: 'Словарь',
  [Type.ENCYCLOPEDIA]: 'Энциклопедия',
  [Type.REFERENCE]: 'Справочник',
  [Type.TEXTBOOK]: 'Учебник',
  [Type.ANTHOLOGY]: 'Хрестоматия',
  [Type.SONGBOOK]: 'Песенник',
  [Type.MANGA]: 'Манга',
};

export enum AgeRating {
  ZERO_PLUS = 'ZeroPlus',
  SIX_PLUS = 'SixPlus',
  TWELVE_PLUS = 'TwelvePlus',
  SIXTEEN_PLUS = 'SixteenPlus',
  EIGHTEEN_PLUS = 'EighteenPlus',
}

export const ageRatingTranslations: Record<AgeRating, string> = {
  [AgeRating.ZERO_PLUS]: '0+',
  [AgeRating.SIX_PLUS]: '6+',
  [AgeRating.TWELVE_PLUS]: '12+',
  [AgeRating.SIXTEEN_PLUS]: '16+',
  [AgeRating.EIGHTEEN_PLUS]: '18+',
};

export enum Periodicity {
  NON_PERIODIC = 'NonPeriodic',
  SERIAL = 'Serial',
  PERIODIC = 'Periodic',
  CONTINUING = 'Continuing',
  SERIES = 'Series',
}

export const periodicityTranslations: Record<Periodicity, string> = {
  [Periodicity.NON_PERIODIC]: 'Непериодическое издание',
  [Periodicity.SERIAL]: 'Сериальное издание',
  [Periodicity.PERIODIC]: 'Периодическое издание',
  [Periodicity.CONTINUING]: 'Продолжающееся издание',
  [Periodicity.SERIES]: 'Серия',
};

export enum MaterialConstruction {
  BOOK_EDITION = 'BookEdition',
  MAGAZINE_EDITION = 'MagazineEdition',
  SHEET_EDITION = 'SheetEdition',
  BOOKLET = 'Booklet',
  NEWSPAPER_EDITION = 'NewspaperEdition',
  CARD_EDITION = 'CardEdition',
  POSTCARD = 'Postcard',
  POSTER = 'Poster',
  VALET_EDITION = 'ValetEdition',
  TOY_BOOK = 'ToyBook',
  MULTI_FORMAT_EDITION = 'MultiFormatEdition',
  COMPOSITE_EDITION = 'CompositeEdition',
}

export const materialConstructionTranslations: Record<MaterialConstruction, string> = {
  [MaterialConstruction.BOOK_EDITION]: 'Книжное издание',
  [MaterialConstruction.MAGAZINE_EDITION]: 'Журнальное издание',
  [MaterialConstruction.SHEET_EDITION]: 'Листовое издание',
  [MaterialConstruction.BOOKLET]: 'Буклет (брошюра)',
  [MaterialConstruction.NEWSPAPER_EDITION]: 'Газетное издание',
  [MaterialConstruction.CARD_EDITION]: 'Карточное издание',
  [MaterialConstruction.POSTCARD]: 'Открытка',
  [MaterialConstruction.POSTER]: 'Плакат / постер',
  [MaterialConstruction.VALET_EDITION]: 'Валетное издание',
  [MaterialConstruction.TOY_BOOK]: 'Книжка-игрушка',
  [MaterialConstruction.MULTI_FORMAT_EDITION]: 'Мультиформатное издание',
  [MaterialConstruction.COMPOSITE_EDITION]: 'Комплексное издание',
};

export enum Category {
  SCIENCE_FICTION = 'ScienceFiction',
  FANTASY = 'Fantasy',
  ALTERNATIVE_HISTORY = 'AlternativeHistory',
  POST_APOCALYPSE = 'PostApocalypse',
  CYBERPUNK = 'Cyberpunk',
  FAIRY_TALE = 'FairyTale',
  CLASSIC_DETECTIVE = 'ClassicDetective',
  POLICE_PROCEDURAL = 'PoliceProcedural',
  PSYCHOLOGICAL_THRILLER = 'PsychologicalThriller',
  SPY_NOVEL = 'SpyNovel',
  CRIME_NOVEL = 'CrimeNovel',
  CONTEMPORARY_PROSE = 'ContemporaryProse',
  HISTORICAL_PROSE = 'HistoricalProse',
  SOCIAL_DRAMA = 'SocialDrama',
  SAGA = 'Saga',
  ADVENTURE_NOVEL = 'AdventureNovel',
  ROMANCE = 'Romance',
  HISTORICAL_ROMANCE = 'HistoricalRomance',
  EROTIC_NOVEL = 'EroticNovel',
  HUMOROUS_NOVEL = 'HumorousNovel',
  GOTHIC_NOVEL = 'GothicNovel',
  MYSTICISM = 'Mysticism',
  HORROR = 'Horror',
  SEA_ADVENTURE = 'SeaAdventure',
  TRAVEL = 'Travel',
  YOUNG_ADULT = 'YoungAdult',
  CHILDRENS_FICTION = 'ChildrensFiction',
  COMICS_GRAPHIC_NOVELS = 'ComicsGraphicNovels',
  BIOGRAPHY_MEMOIRS = 'BiographyMemoirs',
  DOCUMENTARY = 'Documentary',
  HISTORY = 'History',
  JOURNALISM = 'Journalism',
  PSYCHOLOGY = 'Psychology',
  SELF_DEVELOPMENT = 'SelfDevelopment',
  BUSINESS_ECONOMICS = 'BusinessEconomics',
  POLITICAL_SCIENCE = 'PoliticalScience',
  RELIGION_SPIRITUALITY = 'ReligionSpirituality',
  POPULAR_SCIENCE = 'PopularScience',
  GUIDEBOOKS = 'Guidebooks',
  COOKBOOKS = 'Cookbooks',
  ESSAYS = 'Essays',
  HUMOR_SATIRE = 'HumorSatire',
}

export const categoryTranslations: Record<Category, string> = {
  [Category.SCIENCE_FICTION]: 'Научная фантастика',
  [Category.FANTASY]: 'Фэнтези',
  [Category.ALTERNATIVE_HISTORY]: 'Альтернативная история',
  [Category.POST_APOCALYPSE]: 'Постапокалипсис',
  [Category.CYBERPUNK]: 'Киберпанк',
  [Category.FAIRY_TALE]: 'Сказка',
  [Category.CLASSIC_DETECTIVE]: 'Классический детектив',
  [Category.POLICE_PROCEDURAL]: 'Полицейский процедурный',
  [Category.PSYCHOLOGICAL_THRILLER]: 'Психологический триллер',
  [Category.SPY_NOVEL]: 'Шпионский роман',
  [Category.CRIME_NOVEL]: 'Криминальный роман',
  [Category.CONTEMPORARY_PROSE]: 'Современная проза',
  [Category.HISTORICAL_PROSE]: 'Историческая проза',
  [Category.SOCIAL_DRAMA]: 'Социальная драма',
  [Category.SAGA]: 'Сага',
  [Category.ADVENTURE_NOVEL]: 'Авантюрный роман',
  [Category.ROMANCE]: 'Любовный роман',
  [Category.HISTORICAL_ROMANCE]: 'Историко-любовный роман',
  [Category.EROTIC_NOVEL]: 'Эротический роман',
  [Category.HUMOROUS_NOVEL]: 'Юмористический роман',
  [Category.GOTHIC_NOVEL]: 'Готический роман',
  [Category.MYSTICISM]: 'Мистика',
  [Category.HORROR]: 'Хоррор',
  [Category.SEA_ADVENTURE]: 'Морские приключения',
  [Category.TRAVEL]: 'Путешествия',
  [Category.YOUNG_ADULT]: 'Подростковая проза',
  [Category.CHILDRENS_FICTION]: 'Детская художественная литература',
  [Category.COMICS_GRAPHIC_NOVELS]: 'Комиксы и графические романы',
  [Category.BIOGRAPHY_MEMOIRS]: 'Биография / автобиография / мемуары',
  [Category.DOCUMENTARY]: 'Документалистика',
  [Category.HISTORY]: 'История',
  [Category.JOURNALISM]: 'Публицистика',
  [Category.PSYCHOLOGY]: 'Психология',
  [Category.SELF_DEVELOPMENT]: 'Саморазвитие',
  [Category.BUSINESS_ECONOMICS]: 'Бизнес и экономика',
  [Category.POLITICAL_SCIENCE]: 'Политология',
  [Category.RELIGION_SPIRITUALITY]: 'Религия и духовность',
  [Category.POPULAR_SCIENCE]: 'Научно-популярная литература',
  [Category.GUIDEBOOKS]: 'Путеводители',
  [Category.COOKBOOKS]: 'Кулинарные книги',
  [Category.ESSAYS]: 'Эссеистика',
  [Category.HUMOR_SATIRE]: 'Юмор и сатира',
};

export interface CreateBookDto {
  isCashPayment: boolean;
  isbn?: string;
  indexUDK?: string;
  indexBBK?: string;
  isnm?: string;
  title: string;
  frequencyTitle?: string;
  condition: Condition;
  publishedYear: number;
  language: string;
  category: Category[];
  description: string;
  author: string;
  publisher?: string;
  publishingCity: string;
  pages?: number;
  format?: Format;
  printRun?: number;
  weight?: number;
  ageRestriction?: AgeRating;
  price: number;
  deposit: number;
  minDaysToRent: number;
  cardNumber: string;
  availabilityStatus?: BookStatus;
  address: string;
  lat: number;
  lon: number;
  type: Type;
  periodicity?: Periodicity;
  materialConstruction?: MaterialConstruction;
  coverImagesUrls?: string[];
  edition?: number;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface BookResponse {
  id: number;
  userId: number;
  user: IUser;
  isCashPayment: boolean;
  isbn?: string;
  indexUDK?: string;
  indexBBK?: string;
  isnm?: string;
  title: string;
  frequencyTitle?: string;
  condition: Condition;
  publishedYear: number;
  language: string;
  category: Category[];
  description: string;
  author: string;
  publisher?: string;
  publishingCity: string;
  pages?: number;
  format?: Format;
  printRun?: number;
  weight?: number;
  ageRestriction?: AgeRating;
  price: number;
  deposit: number;
  minDaysToRent: number;
  cardNumber: string;
  availabilityStatus: BookStatus;
  createdAt: string;
  updatedAt: string;
  coverImagesUrls: string[];
  bookRating: number | null;
  address: string;
  lat: number;
  lon: number;
  type: Type;
  periodicity?: Periodicity;
  materialConstruction?: MaterialConstruction;
  edition?: number;
  rentalCount: number;
  timesReported: number;
  lastRentedDate?: string;
  addedDate: string;
}

export interface BookReview {
  id: number;
  bookId: number;
  userId: number;
  content: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    lastname: string;
    surname: string | null;
  };
}