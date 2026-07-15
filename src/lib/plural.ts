import type { Dictionary } from "@/i18n/types";

/**
 * "1 категория" / "2 категории" / "5 категорий" — Russian picks between
 * three forms by the last digit; English only ever needs one and many.
 * The dictionary supplies the forms, so the rule stays here and the words
 * stay in the locale file.
 */
export function pluralForm(n: number, forms: [string, string, string]): string {
  const [one, few, many] = forms;
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** "3 категории" — count and the correctly declined word. */
export function categoryCount(n: number, dict: Dictionary): string {
  return `${n} ${pluralForm(n, dict.common.categoryForms)}`;
}
