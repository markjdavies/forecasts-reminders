import * as pino from 'pino';
import { buildReminder } from '../api-handler-factories/reminder-factory';
import { MssqlDataOperations } from '../src/dal/mssql/MssqlDataOperations';
// import { APP_ID, LOG_LEVEL } from "./Config";

export const logger = pino({
    name: 'forecasts-reminder',
    level: 'debug',
});

const db = MssqlDataOperations({
    databaseName: '',
    host: '',
    userName: '',
    password: '',
    port: 1433,
});

export default buildReminder(logger, db, 2);
