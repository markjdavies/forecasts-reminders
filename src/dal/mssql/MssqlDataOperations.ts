import { DatabaseConfig } from './DatabaseConfig';
import { DataOperations } from '../DataOperations';
import * as sql from 'mssql';

interface IStoredProcParam {
    name: string;
    sqlType: (() => sql.ISqlType) | sql.ISqlType;
    value: number | string | boolean | undefined;
}

export const MssqlDataOperations = (config: DatabaseConfig): DataOperations => {
    const connectString = `mssql://${config.userName}:${config.password}@${config.host}/${config.databaseName}`;

    const callProcedure = async <T>(
        name: string,
        inputs: IStoredProcParam[],
    ): Promise<T> => {
        const request = await getRequest();
        inputs.map((i) => request.input(i.name, i.sqlType, i.value));
        const result = await request.execute<T>(name);
        return result.recordset[0][0];
    };

    const getRequest = async (): Promise<sql.Request> => {
        const pool = new sql.ConnectionPool(connectString);
        await pool.connect();
        return new sql.Request(pool);
    };

    return {
        getChatIdForPlayer: async (playerId: number) => {
            return await callProcedure<string>('telegram.GetChatIdForPlayer', [
                {
                    name: 'playerId',
                    sqlType: sql.Int,
                    value: playerId,
                },
            ]);
        },
        getPlayersNextMatchWeek: async (playerId: number) => {
            return await callProcedure<number>(
                'telegram.getPlayersNextMatchWeek',
                [
                    {
                        name: 'playerId',
                        sqlType: sql.Int,
                        value: playerId,
                    },
                ],
            );
        },
        getNextMatchWeek: async () => {
            return await callProcedure<number>(
                'telegram.getPlayersNextMatchWeek',
                [],
            );
        },
        getReminderStatus: async (playerId: number, week: number) => {
            return await callProcedure<boolean>('telegram.getReminderStatus', [
                {
                    name: 'playerId',
                    sqlType: sql.Int,
                    value: playerId,
                },
                {
                    name: 'week',
                    sqlType: sql.Int,
                    value: week,
                },
            ]);
        },
        setRemiderStatus: async (
            playerId: number,
            week: number,
            reminderSent: boolean,
        ) => {
            const request = await getRequest();
            request.input('playerId', sql.Int, playerId);
            request.input('week', sql.Int, week);
            request.input('reminderSent', sql.Bit, reminderSent);
            await request.execute('telegram.setRemiderStatus');
        },
    };
};
