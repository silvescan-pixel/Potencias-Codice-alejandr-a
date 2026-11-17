export interface PowerValidationResult {
  isValid: boolean;
  /** True when the exponent and numeric magnitude match, but parentheses were omitted on a negative base with an even exponent (changing the resulting value). */
  missingParensError: boolean;
  /** True when a negative base without parentheses was accepted because the exponent is odd (producing the exact same value). */
  acceptedWithoutParensOnOdd: boolean;
}

export const cleanMathToken = (s: string): string =>
  s.trim().replace(/\s+/g, '').replace(/[−–]/g, '-');

const stripLeadingPlus = (s: string): string => s.replace(/^\+/, '');

/**
 * Validates a student's power input (base + exponent) against an expected power.
 *
 * Negative base rules:
 * - With parentheses `(-a)`: always valid if the exponent matches.
 * - Without parentheses `-a`:
 *   - If the exponent is ODD (|exp| % 2 === 1), `-a^n` and `(-a)^n` have the exact same value -> ACCEPTED.
 *   - If the exponent is EVEN (|exp| % 2 === 0, including 0), `-a^n = -(a^n) != +(a^n) = (-a)^n` -> REJECTED.
 */
export function validatePowerAnswer(
  userBaseRaw: string,
  userExpRaw: string,
  expectedBaseRaw: string,
  expectedExpRaw: string
): PowerValidationResult {
  const uBase = cleanMathToken(userBaseRaw);
  const uExp = stripLeadingPlus(cleanMathToken(userExpRaw));
  const expCanon = stripLeadingPlus(cleanMathToken(expectedExpRaw));
  const expectedClean = cleanMathToken(expectedBaseRaw);

  if (!uBase || !uExp || uExp !== expCanon) {
    return {
      isValid: false,
      missingParensError: false,
      acceptedWithoutParensOnOdd: false,
    };
  }

  const expectedUnwrapped = expectedClean.replace(/^\((.+)\)$/, '$1');
  const isExpectedNegative = expectedUnwrapped.startsWith('-');

  if (!isExpectedNegative) {
    const uBaseUnwrapped = stripLeadingPlus(uBase.replace(/^\((.+)\)$/, '$1'));
    const expBaseClean = stripLeadingPlus(expectedUnwrapped);
    return {
      isValid: uBaseUnwrapped === expBaseClean,
      missingParensError: false,
      acceptedWithoutParensOnOdd: false,
    };
  }

  const canonicalWithParens = `(${expectedUnwrapped})`; // e.g. "(-3)"
  const bareNegative = expectedUnwrapped;              // e.g. "-3"

  const expNum = Number(expCanon);
  const isOddExp = Number.isInteger(expNum) && Math.abs(expNum) % 2 === 1;

  if (uBase === canonicalWithParens) {
    return {
      isValid: true,
      missingParensError: false,
      acceptedWithoutParensOnOdd: false,
    };
  }

  if (uBase === bareNegative) {
    if (isOddExp) {
      return {
        isValid: true,
        missingParensError: false,
        acceptedWithoutParensOnOdd: true,
      };
    }
    return {
      isValid: false,
      missingParensError: true,
      acceptedWithoutParensOnOdd: false,
    };
  }

  return {
    isValid: false,
    missingParensError: false,
    acceptedWithoutParensOnOdd: false,
  };
}
