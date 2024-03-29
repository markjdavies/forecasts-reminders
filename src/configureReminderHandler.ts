import { MssqlDataOperations } from './dal/mssql/MssqlDataOperations';
import { messageBuilder } from './messageBuilder';
import { telegramWrapper } from './telegram';
import { postgridWrapper } from './postgrid';
import { telegramReminderService } from '../reminder-implementations/telegramReminder';
import { postgridReminderService } from '../reminder-implementations/postgridReminder';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from './utils/logger';
import { config } from './config';

export const configureReminderHandler = (): ((
    req: VercelRequest,
    res: VercelResponse,
) => Promise<void>) => {
    const appConfig = config();

    const db = MssqlDataOperations(appConfig.db);
    const msgBuilder = messageBuilder(logger, appConfig.scoreEntryUrl);

    const telegram = telegramWrapper(appConfig.telegram, logger);
    const telegramSender = telegramReminderService(
        logger,
        db,
        telegram,
        msgBuilder,
        appConfig,
    );

    const postgrid = postgridWrapper(appConfig.postgrid, logger);
    const postgridSender = postgridReminderService(
        logger,
        db,
        postgrid,
        msgBuilder,
        appConfig,
    );

    const handler = async (
        _req: VercelRequest,
        res: VercelResponse,
    ): Promise<void> => {
        const postal = await postgridSender();
        const telegram = await telegramSender();
        res.json({ postal, telegram });
    };
    return handler;
};
