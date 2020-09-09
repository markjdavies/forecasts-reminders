import { Logger } from 'pino';
import { NowRequest, NowResponse } from '@vercel/node';
import { DataOperations } from '../src/dal/DataOperations';
import { ITelegramSender } from '../src/sendMessage';
import { MessageBuilder } from '../src/messageBuilder';

export const buildReminder = (
    log: Logger,
    dataOperations: DataOperations,
    telegram: ITelegramSender,
    messageBuilder: MessageBuilder,
    lookaheadDays: number,
): ((_req: NowRequest, res: NowResponse) => Promise<void>) => {
    const remind = async (
        _req: NowRequest,
        res: NowResponse,
    ): Promise<void> => {
        log.info(`Getting reminders for next ${lookaheadDays} days`);
        const reminders = await dataOperations.getAllPlayerNextMatchDatesForReminder(
            lookaheadDays,
        );

        const promisedReminders = reminders.map(async (reminder) => {
            const playerMatchSummary = await dataOperations.getPlayersNextFixture(
                reminder.playerId,
            );
            log.info({ playerMatchSummary });
            if (playerMatchSummary && reminder.playerId === 3) {
                const message = messageBuilder(playerMatchSummary);
                const messageId = await telegram.send(reminder.chatId, message);
                log.info({ playerMatchSummary, messageId });
            }
            return;
        });

        await Promise.all(promisedReminders);

        res.json({ reminders });
    };

    return remind;
};
