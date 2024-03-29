import { DatabaseConfig } from './DatabaseConfig';
import {
    DataOperations,
    MatchDatesForPostalReminder,
    MatchDatesForReminder,
    NextMatchSubmissionStatus,
    Player,
} from '../DataOperations';
import * as sql from 'mssql';
import { storedProcWrapper } from './MssqlSpWrapper';

export const MssqlDataOperations = (config: DatabaseConfig): DataOperations => {
    const connectString = `Server=${config.host},1433;Database=${config.databaseName};User Id=${config.username};Password=${config.password};Encrypt=false`;

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

        getAllPlayerNextMatchDatesForPostalReminder: async (
            lookaheadDays: number,
        ): Promise<MatchDatesForPostalReminder[]> => {
            const result = await callProc<MatchDatesForPostalReminder>(
                'telegram.getAllPlayerNextMatchDatesForPostalReminder',
                {
                    lookaheadDays,
                },
            );
            return result;
        },

        getChatIdForPlayer: async (playerId: number): Promise<string> =>
            (await callProc<string>('telegram.GetChatIdForPlayer', {
                playerId,
            }))[0][0],

        getPlayerById: async (id) =>
            (await callProc<Player>('telegram.GetPlayerById', { id }))[0],

        getPlayersNextMatchWeek: async (playerId: number): Promise<number> =>
            (await callProc<number>('telegram.getPlayersNextMatchWeek', {
                playerId,
            }))[0][0],

        getNextMatchPeriod: async (): Promise<number> =>
            (await callProc<number>(
                'telegram.getPlayersNextMatchWeek',
            ))[0][0],

        getReminderStatus: async (
            playerId: number,
            periodNumber: number,
        ): Promise<boolean> =>
            (await callProc<boolean>('telegram.getReminderStatus', {
                playerId,
                periodNumber,
            }))[0][0],

        setRemiderStatus: async (
            playerId: number,
            periodNumber: number,
            reminderSent: Date,
        ): Promise<void> => {
            const request = await getRequest();
            request.input('playerId', sql.Int, playerId);
            request.input('periodNumber', sql.Int, periodNumber);
            request.input('reminderSent', sql.DateTime, reminderSent);
            await request.execute('telegram.setRemiderStatus');
        },

        setPostalRemiderStatus: async (
            playerId: number,
            periodNumber: number,
            reminderSent: Date,
        ): Promise<void> => {
            const request = await getRequest();
            request.input('playerId', sql.Int, playerId);
            request.input('periodNumber', sql.Int, periodNumber);
            request.input('reminderSent', sql.DateTime, reminderSent);
            await request.execute('telegram.setPostalRemiderStatus');
        },

        getPlayersNextFixture: async (
            playerId: number,
        ): Promise<NextMatchSubmissionStatus | undefined> => {
            const request = await getRequest();
            request.input('playerId', sql.Int, playerId);
            const result = await request.execute(
                'telegram.GetPlayersNextFixture',
            );
            if (Array.isArray(result.recordsets) && result.recordsets.length > 0) {
                return result.recordsets[0][0];
            } else {
                return undefined;
            }
        },

        getPlayerPredictions: async (
            playerId: number,
            periodNumber: number,
        ) => {
            const request = await getRequest();
            request.input('player', sql.Int, playerId);
            request.input('periodNumber', sql.Int, periodNumber);
            const result = await request.execute(
                'telegram.getPlayerPredictions',
            );
            if (Array.isArray(result.recordsets) && result.recordsets.length > 0) {
                return result.recordsets[0].filter((p) => p.home !== null);
            } else {
                return [];
            }
        },
    };
};
