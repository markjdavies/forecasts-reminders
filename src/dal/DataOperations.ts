export interface DataOperations {
    getChatIdForPlayer: (playerId: number) => Promise<string>;
    getPlayersNextMatchWeek: (playerId: number) => Promise<number>;
    getNextMatchWeek: () => Promise<number>;
    getReminderStatus: (playerId: number, week: number) => Promise<boolean>;
    setRemiderStatus: (
        playerId: number,
        week: number,
        reminderSent: boolean,
    ) => Promise<void>;
}
