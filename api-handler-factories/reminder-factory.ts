import { Logger } from 'pino';
import { NowRequest, NowResponse } from '@vercel/node';
import { DataOperations } from '../src/dal/DataOperations';

export const buildReminder = (
    log: Logger,
    dataOperations: DataOperations,
    lookaheadDays: number,
): ((_req: NowRequest, res: NowResponse) => void) => {
    const remind = async (
        _req: NowRequest,
        res: NowResponse,
    ): Promise<void> => {
        const reminders = await dataOperations.getAllPlayerNextMatchDatesForReminder(
            lookaheadDays,
        );

        res.json(reminders);
    };

    return remind;
};
