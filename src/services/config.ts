/**
 * Set VITE_USE_DEMO_DATA=false and VITE_API_BASE_URL in a .env file to switch the
 * frontend from local demonstration data to a FastAPI backend.
 */
export const USE_DEMO_DATA: boolean = import.meta.env.VITE_USE_DEMO_DATA !== 'false';
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
