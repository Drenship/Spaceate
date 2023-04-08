
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegex.test(email);
};

export function verifyPassword(password: string, rules: {
  minLength?: number;
  maxLength?: number;
  minUpperCase?: number;
  minLowerCase?: number;
  minNumbers?: number;
  minSpecialChars?: number;
}): [boolean, {
  isLength: boolean,
  isUpperCase: boolean,
  isLowerCase: boolean,
  isNumbers: boolean,
  isSpecialChars: boolean,
}] {
  const isLength = rules.minLength ? password.length >= rules.minLength : true;
  const isUpperCase = rules.minUpperCase ? (password.match(/[A-Z]/g) || []).length >= rules.minUpperCase : true;
  const isLowerCase = rules.minLowerCase ? (password.match(/[a-z]/g) || []).length >= rules.minLowerCase : true;
  const isNumbers = rules.minNumbers ? (password.match(/[0-9]/g) || []).length >= rules.minNumbers : true;
  const isSpecialChars = rules.minSpecialChars ? (password.match(/[^a-zA-Z0-9]/g) || []).length >= rules.minSpecialChars : true;

  const isValid = isLength && isUpperCase && isLowerCase && isNumbers && isSpecialChars;

  return [isValid, {
    isLength,
    isUpperCase,
    isLowerCase,
    isNumbers,
    isSpecialChars,
  }];
}

export function verifyPhone(phone: string, options: {
  format?: RegExp,
  minLength?: number,
  maxLength?: number,
}): [boolean, {
  isFormat: boolean,
  isLength: boolean,
}] {
  const defaultFormat = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;
  const format = options.format || defaultFormat;

  const isFormat = phone.match(format) !== null;
  const isLength = (options.minLength ? phone.length >= options.minLength : true)
    && (options.maxLength ? phone.length <= options.maxLength : true);

  const isValid = isFormat && isLength;

  return [isValid, {
    isFormat,
    isLength,
  }];
}