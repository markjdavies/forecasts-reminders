import * as pino from 'pino';
import * as Config from 'config';

export const logger = pino(Config.get('app.log'));
