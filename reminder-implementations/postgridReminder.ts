import { Logger } from 'pino';
import {
    DataOperations,
    MatchDatesForPostalReminder,
} from '../src/dal/DataOperations';
import { AppConfig } from '../src/app-config/appConfig';
import { IPostgridSender } from '../src/postgrid';
import { MessageBuilder } from '../src/messageBuilder';
import { utcToZonedTime } from 'date-fns-tz';

export const postgridReminderService = (
    log: Logger,
    dataOperations: DataOperations,
    postgrid: IPostgridSender,
    messageBuilder: MessageBuilder,
    config: AppConfig,
): (() => Promise<MatchDatesForPostalReminder[]>) => {
    const { lookaheadDaysPostal } = config;

    const sendTelegramReminders = async (): Promise<
        MatchDatesForPostalReminder[]
    > => {
        log.info(
            `Getting postal reminders for next ${lookaheadDaysPostal} days`,
        );
        const reminders = await dataOperations.getAllPlayerNextMatchDatesForPostalReminder(
            lookaheadDaysPostal,
        );

        const promisedReminders = reminders.map(async (reminder) => {
            const playerMatchSummary = await dataOperations.getPlayersNextFixture(
                reminder.playerId,
            );
            const predictions = await dataOperations.getPlayerPredictions(
                reminder.playerId,
                reminder.periodNumber,
            );

            log.info({ playerMatchSummary, predictions });
            if (playerMatchSummary) {
                const { matchSummary } = messageBuilder(playerMatchSummary);
                await postgrid.send({
                    matchSummary,
                    contactId: reminder.contactId,
                    greeting: reminder.greeting,
                    predictions,
                });
                log.info({ playerMatchSummary });
                await dataOperations.setPostalRemiderStatus(
                    reminder.playerId,
                    reminder.periodNumber,
                    UKNow(),
                );
            }
        });

        await Promise.all(promisedReminders);

        return reminders;
    };
    return sendTelegramReminders;
};

function UKNow() {
    const timeNow = Date.now();
    const timeZone = 'Europe/London';
    const zonedDate = utcToZonedTime(timeNow, timeZone);
    return zonedDate;
}
