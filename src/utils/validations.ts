export interface IValidation {
  validation: RegExp;
  validationText: string;
}

export const charsLessThanValidation = (length: number): IValidation => ({
  validation: new RegExp(`^.{${length},}$`),
  validationText: `Минимальное количество символов ${length}`,
});
