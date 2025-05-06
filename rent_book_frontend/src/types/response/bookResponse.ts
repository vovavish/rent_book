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

export enum Format {
  SMALL_FORMAT = 'SmallFormat',
  POCKET_EDITION = 'PocketEdition',
  MINIATURE = 'Miniature',
  TINY_BOOK = 'TinyBook',
  FOLIO = 'Folio',
}

export enum BookStatus {
  ACTIVE = 'ACTIVE',
  RENTED = 'RENTED',
  CLOSED = 'CLOSED',
}

export enum Type {
  BOOK = 'Book',
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

export enum AgeRating {
  ZERO_PLUS = 'ZeroPlus',
  SIX_PLUS = 'SixPlus',
  TWELVE_PLUS = 'TwelvePlus',
  SIXTEEN_PLUS = 'SixteenPlus',
  EIGHTEEN_PLUS = 'EighteenPlus',
}

export enum Periodicity {
  NON_PERIODIC = 'NonPeriodic',
  SERIAL = 'Serial',
  PERIODIC = 'Periodic',
  CONTINUING = 'Continuing',
  SERIES = 'Series',
}

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

export interface CreateBookDto {
  isbn: string;
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
  user: IUser;
  isbn: string;
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