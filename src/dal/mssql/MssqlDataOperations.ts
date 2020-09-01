import { DatabaseConfig } from './DatabaseConfig';
import { DataOperations } from '../DataOperations';
import * as sql from 'mssql';

export const MssqlDataOperations = (config: DatabaseConfig): DataOperations => {
    const connectString = `mssql://${config.userName}:${config.password}@${config.host}/${config.databaseName}`;

    const getRequest = async (): Promise<sql.Request> => {
        const pool = new sql.ConnectionPool(connectString);
        await pool.connect();
        return new sql.Request(pool);
    };

    return {
        getChatIdForPlayer: async (playerId: number) => {
            const request = await getRequest();
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
