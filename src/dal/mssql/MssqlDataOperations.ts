import { DatabaseConfig } from './DatabaseConfig';
import { DataOperations } from '../DataOperations';
import * as sql from 'mssql';

interface IStoredProcParam {
    name: string;
    sqlType: (() => sql.ISqlType) | sql.ISqlType;
    value: any;
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
        getChatIdForPlayer: async (playerId: Number) => {
            return await callProcedure<string>('telegram.GetChatIdForPlayer', [
                {
                    name: 'playerId',
                    sqlType: sql.Int,
                    value: playerId,
                },
            ]);
        },
        getPlayersNextMatchWeek: async (playerId: Number) => {
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
            return await callProcedure<Number>(
                'telegram.getPlayersNextMatchWeek',
                [],
            );
        },
    };
};

//     public async GetPlayerFromInvitationId(
//         invitationGuid: string
//     ): Promise<Player> {
//         const request = await this.getRequest();
//         request.input('invitationId', sql.UniqueIdentifier, invitationGuid);
//         const result = await request.execute<Player>(
//             'telegram.GetPlayerFromInvitationId'
//         );
//         return result.recordsets[0][0];
//     }

//     public async SetPlayerChatId(
//         playerId: number,
//         chatId: number
//     ): Promise<void> {
//         const request = await this.getRequest();
//         request.input('playerId', sql.Int, playerId);
//         request.input('chatId', sql.Int, chatId);
//         await request.execute<Player>('telegram.SetPlayerChatId');
//         return;
//     }

//     public async GetPlayerFromChatId(chatId: number): Promise<Player> {
//         const request = await this.getRequest();
//         request.input('chatId', sql.Int, chatId);
//         const result = await request.execute<Player>(
//             'telegram.GetPlayerFromChatId'
//         );
//         return result.recordsets[0][0];
//     }

//     public async GetNextFixture(): Promise<RoundDate> {
//         const request = await this.getRequest();
//         const result = await request.execute<RoundDate>(
//             'telegram.GetNextFixture'
//         );
//         return result.recordsets[0][0];
//     }

//     public async GetMyNextFixture(playerId: number): Promise<RoundDate> {
//         const request = await this.getRequest();
//         request.input('playerId', sql.Int, playerId);
//         const result = await request.execute<RoundDate>(
//             'telegram.GetPlayersNextFixture'
//         );
//         return result.recordsets[0][0];
//     }
// }
