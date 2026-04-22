export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPseudo = (value: string) =>
  /^[a-zA-Z0-9_.]{3,32}$/.test(value.trim());

export const isValidName = (value: string) => value.trim().length >= 2;

export const isValidPassword = (value: string) => value.length >= 8;
