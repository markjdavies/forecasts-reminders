import { Logger } from 'pino';
import { NowRequest, NowResponse } from '@vercel/node';
import { DataOperations } from '../src/dal/DataOperations';
import { ITelegramSender } from '../src/sendMessage';
import { MessageBuilder } from '../src/messageBuilder';
import { IReminderServiceConfig } from '../src/app-config/appConfig';
import { utcToZonedTime } from 'date-fns-tz';

export const buildReminder = (
    log: Logger,
    dataOperations: DataOperations,
    telegram: ITelegramSender,
    messageBuilder: MessageBuilder,
    config: IReminderServiceConfig,
): ((_req: NowRequest, res: NowResponse) => Promise<void>) => {
    const { betaPlayers, lookaheadDays, operatingHours } = config;

    const ignoreUntilOperatingHours = (): boolean => {
        const ukNow = UKNow();
        return (
            ukNow.getHours() < operatingHours.start ||
            ukNow.getHours() >= operatingHours.end
        );
    };

    const skipPlayer = (playerId: number): boolean => {
        if (
            betaPlayers &&
            betaPlayers.length > 0 &&
            !betaPlayers.includes(playerId)
        ) {
            log.info(`Skipping player ${playerId} - not in betaPlayers`);
            return true;
        } else {
            return false;
        }
    };

    const remind = async (
        _req: NowRequest,
        res: NowResponse,
    ): Promise<void> => {
        if (ignoreUntilOperatingHours()) {
            res.json({ message: 'Outside of operating hours.' });
            return;
        }

        log.info(`Getting reminders for next ${lookaheadDays} days`);
        const reminders = await dataOperations.getAllPlayerNextMatchDatesForReminder(
            lookaheadDays,
        );

        try {
            const promisedReminders = reminders.map(async (reminder) => {
                if (skipPlayer(reminder.playerId)) {
                    return;
                }

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
        } catch (err) {
            log.error({ err });
            res.status(500).json({ message: err.message });
        }
    };

    return remind;
};
function UKNow() {
    const timeNow = Date.now();
    const timeZone = 'Europe/London';
    const zonedDate = utcToZonedTime(timeNow, timeZone);
    return zonedDate;
}
