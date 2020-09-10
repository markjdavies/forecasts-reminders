import * as Config from 'config';
import * as pino from 'pino';
import { buildReminder } from '../api-handler-factories/reminder-factory';
import { MssqlDataOperations } from './dal/mssql/MssqlDataOperations';
import { messageBuilder } from './messageBuilder';
import { telegramWrapper } from './sendMessage';
import { NowRequest, NowResponse } from '@vercel/node';
import { IAppConfig } from './app-config/appConfig';

export const configureReminderHandler = (): ((
    _req: NowRequest,
    res: NowResponse,
) => void) => {
    const config = {
        ...Config.get<IAppConfig>('app'),
        ...{ app: process.env.app },
    };

    const logger = pino(config.log);
    const db = MssqlDataOperations(config.db);
    const telegram = telegramWrapper(config.telegram, logger);
    const msgBuilder = messageBuilder(
        logger,
        config.reminderService.scoreEntryUrl,
    );
    const handler = buildReminder(
        logger,
        db,
        telegram,
        msgBuilder,
        config.reminderService,
    );
    logger.info('Configured reminderHandler');
    return handler;
};
