export const CURRENCY = "eur";
export const CURRENCY_SYMBOL = "€";

export const PASSWORD_REQUIRED = {
    minLength: 8,
    minUpperCase: 1,
    minLowerCase: 1,
    minNumbers: 1,
    minSpecialChars: 1,
}

export const PHONE_REQUIRED = {
    format: /^(\+|00)[1-9]\d{1,14}$/,
    minLength: 9,
    maxLength: 15,
}