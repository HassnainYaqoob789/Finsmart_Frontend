let development = false;

export const API_BASE_URL = development
    ? "http://localhost:8888/api/"
    : "https://invoice.alisonstech-dev.com/backends/api/";

export const BASE_URL = development
    ? "http://localhost:8888/api/"
    : "https://invoice.alisonstech-dev.com/backends/";

export const DOWNLOAD_BASE_URL = development
    ? "http://localhost:8888/download/"
    : "https://invoice.alisonstech-dev.com/backends/download/";
export const ACCESS_TOKEN_NAME = "x-auth-token";

export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;
