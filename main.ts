import { createServer } from 'vercel-node-server';
import * as pino from 'pino';
import { buildReminder } from './api-handler-factories/reminder-factory';
import { MssqlDataOperations } from './src/dal/mssql/MssqlDataOperations';
// import { APP_ID, LOG_LEVEL } from "./Config";

export const logger = pino({
    name: 'forecasts-reminder-local',
    level: 'debug',
});

const db = MssqlDataOperations({
    databaseName: '',
    host: '',
    userName: '',
    password: '',
    port: 1433,
});

const reminder = buildReminder(logger, db, 8);

const server = createServer(reminder);

// start listening on port 8000
server.listen(8000);
