export interface DataOperations {
    getAllPlayerNextMatchDatesForReminder: (
        lookaheadDays: number,
    ) => Promise<MatchDatesForReminder[]>;
    getChatIdForPlayer: (playerId: number) => Promise<string>;
    getPlayersNextMatchWeek: (playerId: number) => Promise<number>;
    getNextMatchPeriod: () => Promise<number>;
    getReminderStatus: (playerId: number, period: number) => Promise<boolean>;
    setRemiderStatus: (
        playerId: number,
        periodNumber: number,
        reminderSent: Date,
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
    roundName: string;
    date: Date;
    home: number;
    away: number;
    homeTeam: string;
    awayTeam: string;
    submissionTime: Date;
}
