import * as Config from 'config';
import * as pino from 'pino';
import { buildReminder } from '../api-handler-factories/reminder-factory';
import { MssqlDataOperations } from './dal/mssql/MssqlDataOperations';
import { DatabaseConfig } from './dal/mssql/DatabaseConfig';
import { messageBuilder } from './messageBuilder';
import { telegramWrapper } from './sendMessage';
import { ITelegramConfig } from './TelegramConfig';
import { NowRequest, NowResponse } from '@vercel/node';

export const configureReminderHandler = (): ((
    _req: NowRequest,
    res: NowResponse,
) => void) => {
    const logger = pino(Config.get('log'));
    const db = MssqlDataOperations(Config.get<DatabaseConfig>('db'));
    const telegram = telegramWrapper(
        Config.get<ITelegramConfig>('telegram'),
        logger,
    );
    const msgBuilder = messageBuilder(
        logger,
        Config.get<string>('scoreEntryUrl'),
    );
    const lookaheadDays = Config.get<number>('lookaheadDays');
    const handler = buildReminder(
        logger,
        db,
        telegram,
        msgBuilder,
        lookaheadDays,
    );
    logger.info('Configured reminderHandler');
    return handler;
};
