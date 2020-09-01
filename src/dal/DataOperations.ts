export interface DataOperations {
    getChatIdForPlayer: (playerId: Number) => Promise<string>;
    getPlayersNextMatchWeek: (playerId: Number) => Promise<number>;
    getNextMatchWeek: () => Promise<Number>;
    // getReminderStatus: (playerId: number, week: number) => Promise<boolean>;
    // setRemiderStatus: (
    //     playerId: number,
    //     week: number,
    //     reminderSent: boolean,
    // ) => Promise<void>;
}
