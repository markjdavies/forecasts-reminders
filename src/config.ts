import { parseEnv } from 'znv';
import { AppConfig, appConfigSchema } from './app-config/appConfig';

export const config = (): AppConfig => parseEnv(process.env, appConfigSchema);
