import { AgeRating, ageRatingTranslations, Category, categoryTranslations, Condition, conditionTranslations, Format, formatTranslations, MaterialConstruction, materialConstructionTranslations, Periodicity, periodicityTranslations, Type, typeTranslations } from "../types/response/bookResponse";

export const typeOptions = [
  { value: undefined, label: 'Не выбрано' },
  ...Object.values(Type).map((type) => ({
    value: type,
    label: typeTranslations[type],
  })),
];

export const conditionOptions = [
  { value: undefined, label: 'Не выбрано' },
  ...Object.values(Condition).map((cond) => ({
    value: cond,
    label: conditionTranslations[cond],
  })),
];

export const ageRatingOptions = [
  { value: undefined, label: 'Не выбрано' },
  ...Object.values(AgeRating).map((rating) => ({
    value: rating,
    label: ageRatingTranslations[rating],
  })),
];

export const periodicityOptions = [
  { value: undefined, label: 'Не выбрано' },
  ...Object.values(Periodicity).map((period) => ({
    value: period,
    label: periodicityTranslations[period],
  })),
];

export const materialConstructionOptions = [
  { value: undefined, label: 'Не выбрано' },
  ...Object.values(MaterialConstruction).map((material) => ({
    value: material,
    label: materialConstructionTranslations[material],
  })),
];

export const formatOptions = [
  { value: undefined, label: 'Не выбрано' },
  ...Object.values(Format).map((format) => ({
    value: format,
    label: formatTranslations[format],
  })),
];

export type CategoryOption = {
  value: Category;
  label: string;
};

export const categoryOptions: CategoryOption[] = Object.values(Category).map((cat) => ({
  value: cat,
  label: categoryTranslations[cat],
}));