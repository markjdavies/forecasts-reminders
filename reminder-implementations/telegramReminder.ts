import { Logger } from 'pino';
import {
    DataOperations,
    MatchDatesForReminder,
} from '../src/dal/DataOperations';
import { ITelegramSender } from '../src/telegram';
import { MessageBuilder } from '../src/messageBuilder';
import { utcToZonedTime } from 'date-fns-tz';
import { AppConfig } from '../src/app-config/appConfig';

export type ReminderResponse = {
    message?: string;
    reminders?: MatchDatesForReminder[];
};

export const telegramReminderService = (
    log: Logger,
    dataOperations: DataOperations,
    telegram: ITelegramSender,
    messageBuilder: MessageBuilder,
    config: AppConfig,
): (() => Promise<ReminderResponse>) => {
    const { lookaheadDays, operatingHours } = config;

    const ignoreUntilOperatingHours = (): boolean => {
        const ukNow = UKNow();
        return (
            ukNow.getHours() < operatingHours.start ||
            ukNow.getHours() >= operatingHours.end
        );
    };

    const sendTelegramReminders = async (): Promise<ReminderResponse> => {
        if (ignoreUntilOperatingHours()) {
            return { message: 'Outside of operating hours.' };
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

        return { reminders };
    };
    return sendTelegramReminders;
};

function UKNow() {
    const timeNow = Date.now();
    const timeZone = 'Europe/London';
    const zonedDate = utcToZonedTime(timeNow, timeZone);
    return zonedDate;
}
