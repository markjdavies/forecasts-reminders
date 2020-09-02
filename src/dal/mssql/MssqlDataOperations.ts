import { DatabaseConfig } from './DatabaseConfig';
import { DataOperations } from '../DataOperations';
import * as sql from 'mssql';
import { storedProcWrapper } from './MssqlSpWrapper';

export const MssqlDataOperations = (config: DatabaseConfig): DataOperations => {
    const connectString = `mssql://${config.userName}:${config.password}@${config.host}/${config.databaseName}`;

    const getRequest = async (): Promise<sql.Request> => {
        const pool = new sql.ConnectionPool(connectString);
        await pool.connect();
        return new sql.Request(pool);
    };

    const callProc = storedProcWrapper(getRequest).callProcedure;

    return {
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
    };
};
