import { DatabaseConfig } from './DatabaseConfig';
import {
    DataOperations,
    MatchDatesForReminder,
    NextMatchSubmissionStatus,
} from '../DataOperations';
import * as sql from 'mssql';
import { storedProcWrapper } from './MssqlSpWrapper';
import { res } from 'pino-std-serializers';

export const MssqlDataOperations = (config: DatabaseConfig): DataOperations => {
    const connectString = `mssql://${config.userName}:${config.password}@${config.host}/${config.databaseName}`;

    const getRequest = async (): Promise<sql.Request> => {
        const pool = new sql.ConnectionPool(connectString);
        await pool.connect();
        return new sql.Request(pool);
    };

    const callProc = storedProcWrapper(getRequest).callProcedure;

    return {
        getAllPlayerNextMatchDatesForReminder: async (
            lookaheadDays: number,
        ): Promise<MatchDatesForReminder[]> => {
            const result = await callProc<MatchDatesForReminder>(
                'telegram.getAllPlayerNextMatchDatesForReminder',
                {
                    lookaheadDays,
                },
            );
            return result;
        },
        getChatIdForPlayer: async (playerId: number): Promise<string> => {
            return await callProc<string>('telegram.GetChatIdForPlayer', {
                playerId,
            })[0][0];
        },
        getPlayersNextMatchWeek: async (playerId: number): Promise<number> => {
            return await callProc<number>('telegram.getPlayersNextMatchWeek', {
                playerId,
            })[0][0];
        },
        getNextMatchWeek: async (): Promise<number> => {
            return await callProc<number>(
                'telegram.getPlayersNextMatchWeek',
            )[0][0];
        },
        getReminderStatus: async (
            playerId: number,
            week: number,
        ): Promise<boolean> => {
            return await callProc<boolean>('telegram.getReminderStatus', {
                playerId,
                week,
            })[0][0];
        },
        setRemiderStatus: async (
            playerId: number,
            week: number,
            reminderSent: boolean,
        ): Promise<void> => {
            const request = await getRequest();
            request.input('playerId', sql.Int, playerId);
            request.input('week', sql.Int, week);
            request.input('reminderSent', sql.Bit, reminderSent);
            await request.execute('telegram.setRemiderStatus');
        },
        getPlayersNextFixture: async (
            playerId: number,
        ): Promise<NextMatchSubmissionStatus | undefined> => {
            const request = await getRequest();
            request.input('playerId', sql.Int, playerId);
            const result = await request.execute(
                'telegram.getPlayersNextFixture',
            );
            if (result.rowsAffected.length > 0) {
                return result[0];
            } else {
                return undefined;
            }
        },
    };
};
