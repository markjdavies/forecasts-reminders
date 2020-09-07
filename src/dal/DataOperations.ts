export interface DataOperations {
    getAllPlayerNextMatchDatesForReminder: (
        lookaheadDays: number,
    ) => Promise<MatchDatesForReminder[]>;
    getChatIdForPlayer: (playerId: number) => Promise<string>;
    getPlayersNextMatchWeek: (playerId: number) => Promise<number>;
    getNextMatchWeek: () => Promise<number>;
    getReminderStatus: (playerId: number, week: number) => Promise<boolean>;
    setRemiderStatus: (
        playerId: number,
        week: number,
        reminderSent: boolean,
    ) => Promise<void>;
    getPlayersNextFixture: (
        playerId: number,
    ) => Promise<NextMatchSubmissionStatus | undefined>;
}

export interface MatchDatesForReminder {
    periodNumber: number;
    startDate: Date;
    playerId: number;
    chatId: string;
}

export interface NextMatchSubmissionStatus {
    date: Date;
    roundName: string;
    home: number;
    away: number;
    homeTeam: string;
    awayTeam: string;
    submissionTime: Date;
}
