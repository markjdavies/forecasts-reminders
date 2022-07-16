import { MssqlDataOperations } from './dal/mssql/MssqlDataOperations';
import { messageBuilder } from './messageBuilder';
import { telegramWrapper } from './telegram';
import { postgridWrapper } from './postgrid';
import { telegramReminderService } from '../reminder-implementations/telegramReminder';
import { postgridReminderService } from '../reminder-implementations/postgridReminder';
import { NowRequest, NowResponse } from '@vercel/node';
import { IAppConfig } from './app-config/appConfig';
import { logger } from './utils/logger';
import Config from './config';

export const configureReminderHandler = (): ((
    req: NowRequest,
    res: NowResponse,
) => Promise<void>) => {
    const config = Config.get<IAppConfig>('app');

    const db = MssqlDataOperations(config.db);
    const msgBuilder = messageBuilder(
        logger,
        config.reminderService.scoreEntryUrl,
    );

    const telegram = telegramWrapper(config.telegram, logger);
    const telegramSender = telegramReminderService(
        logger,
        db,
        telegram,
        msgBuilder,
        config.reminderService,
    );

    const postgrid = postgridWrapper(config.postgrid, logger);
    const postgridSender = postgridReminderService(
        logger,
        db,
        postgrid,
        msgBuilder,
        config.reminderService,
    );

    const handler = async (
        _req: NowRequest,
        res: NowResponse,
    ): Promise<void> => {
        const postal = await postgridSender();
        const telegram = await telegramSender();
        res.json({ postal, telegram });
    };
    return handler;
};
