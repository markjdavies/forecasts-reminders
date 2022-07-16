import { NowResponse } from '@vercel/node';
import { Logger } from 'pino';
import { DataOperations } from '../src/dal/DataOperations';
import { IReminderServiceConfig } from '../src/app-config/appConfig';
import { ITelegramSender } from '../src/telegram';
import { MessageBuilder } from '../src/messageBuilder';
import { utcToZonedTime } from 'date-fns-tz';

export const telegramReminderService = (
    log: Logger,
    dataOperations: DataOperations,
    telegram: ITelegramSender,
    messageBuilder: MessageBuilder,
    config: IReminderServiceConfig,
): ((res: NowResponse) => Promise<void>) => {
    const { lookaheadDays, operatingHours } = config;

    const ignoreUntilOperatingHours = (): boolean => {
        const ukNow = UKNow();
        return (
            ukNow.getHours() < operatingHours.start ||
            ukNow.getHours() >= operatingHours.end
        );
    };

    const sendTelegramReminders = async (res: NowResponse): Promise<void> => {
        if (ignoreUntilOperatingHours()) {
            res.json({ message: 'Outside of operating hours.' });
            return;
        }

        log.info(`Getting reminders for next ${lookaheadDays} days`);
        const reminders = await dataOperations.getAllPlayerNextMatchDatesForReminder(
            lookaheadDays,
        );

        const promisedReminders = reminders.map(async (reminder) => {
            const playerMatchSummary = await dataOperations.getPlayersNextFixture(
                reminder.playerId,
            );
            log.info({ playerMatchSummary });
            if (playerMatchSummary) {
                const message = messageBuilder(playerMatchSummary);
                await telegram.send(reminder.chatId, message);
                log.info({ playerMatchSummary });
                await dataOperations.setRemiderStatus(
                    reminder.playerId,
                    reminder.periodNumber,
                    UKNow(),
                );
            }
            return;
        });

        await Promise.all(promisedReminders);

        res.json({ reminders });
    };
    return sendTelegramReminders;
};

function UKNow() {
    const timeNow = Date.now();
    const timeZone = 'Europe/London';
    const zonedDate = utcToZonedTime(timeNow, timeZone);
    return zonedDate;
}
