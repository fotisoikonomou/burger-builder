export const API_BASE_URL = 'https://burger-app-api.vercel.app';
export const IMAGE_BASE_URL = 'https://exercise-burger-app-api.vercel.app/img';

/** The API's JWT expires after 10 minutes. */
export const TOKEN_TTL_MS = 10 * 60 * 1000;

export const ingredientImageUrl = (src: string): string =>
  `${IMAGE_BASE_URL}/${src}`;
