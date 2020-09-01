import { DatabaseConfig } from './src/dal/mssql/DatabaseConfig';

export interface IForecastsDatabase {
    getChatIdForPlayer: (playerId: number) => string;
    getPlayersNextMatchWeek: (playerId: number) => number;
    getNextMatchWeek: () => number;
    getReminderStatus: (playerId: number, week: number) => boolean;
    setRemiderStatus: (
        playerId: number,
        week: number,
        reminderSent: boolean,
    ) => void;
}

export const ForecastsDatabase = (
    config: DatabaseConfig,
): IForecastsDatabase => {
    return null;
};
