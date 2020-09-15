import { default as Config } from 'config';
import { buildReminder } from '../api-handler-factories/reminder-factory';
import { MssqlDataOperations } from './dal/mssql/MssqlDataOperations';
import { messageBuilder } from './messageBuilder';
import { telegramWrapper } from './sendMessage';
import { NowRequest, NowResponse } from '@vercel/node';
import { IAppConfig } from './app-config/appConfig';
import { logger } from './utils/logger';

export const configureReminderHandler = (): ((
    req: NowRequest,
    res: NowResponse,
) => Promise<void>) => {
    process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
    console.log('NODE_CONFIG_DIR: ' + Config.util.getEnv('NODE_CONFIG_DIR'));
    const config = Config.get<IAppConfig>('app');

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
