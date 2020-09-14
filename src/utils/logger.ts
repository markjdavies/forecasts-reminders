import { default as pino } from 'pino';

export const logger = pino({
    name: 'forecasts-reminder',
    level: 'debug',
});
