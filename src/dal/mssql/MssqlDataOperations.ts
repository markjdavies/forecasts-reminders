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

    const spWrapper = storedProcWrapper(getRequest);

    return {
        getChatIdForPlayer: async (playerId: number): Promise<string> => {
            return await spWrapper<string>('telegram.GetChatIdForPlayer', [
                {
                    name: 'playerId',
                    value: playerId,
                },
            ]);
        },
        getPlayersNextMatchWeek: async (playerId: number): Promise<number> => {
            return await spWrapper<number>('telegram.getPlayersNextMatchWeek', [
                {
                    name: 'playerId',
                    value: playerId,
                },
            ]);
        },
        getNextMatchWeek: async (): Promise<number> => {
            return await spWrapper<number>(
                'telegram.getPlayersNextMatchWeek',
                [],
            );
        },
        getReminderStatus: async (
            playerId: number,
            week: number,
        ): Promise<boolean> => {
            return await spWrapper<boolean>('telegram.getReminderStatus', [
                {
                    name: 'playerId',
                    value: playerId,
                },
                {
                    name: 'week',
                    value: week,
                },
            ]);
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
