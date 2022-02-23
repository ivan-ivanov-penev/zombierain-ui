export const GAME_WIDTH_MAX = 1440;
export const GAME_HEIGHT_MAX = 1080;
export const GAME_WIDTH_MIN = GAME_WIDTH_MAX / 4;
export const GAME_HEIGHT_MIN = GAME_HEIGHT_MAX / 4;
export const GAME_FPS = 60;

export const IMAGE_DIR_NAME = 'image';
export const SOUND_DIR_NAME = 'sound';

export const API_DOMAIN = `zombierain.io`;
export const API_PORT = 8443;
export const API_PATH = `api/v1`;
export const API_URL_HTTP = `https://${API_DOMAIN}:${API_PORT}/${API_PATH}/game`;
export const API_URL_WS = `wss://${API_DOMAIN}:${API_PORT}/${API_PATH}/output`;
export const API_PREFIX = `/input`;
