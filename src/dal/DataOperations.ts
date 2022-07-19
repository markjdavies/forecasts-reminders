export interface DataOperations {
    getAllPlayerNextMatchDatesForReminder: (
        lookaheadDays: number,
    ) => Promise<MatchDatesForReminder[]>;
    getAllPlayerNextMatchDatesForPostalReminder: (
        lookaheadDays: number,
    ) => Promise<MatchDatesForPostalReminder[]>;
    getChatIdForPlayer: (playerId: number) => Promise<string>;
    getPlayersNextMatchWeek: (playerId: number) => Promise<number>;
    getNextMatchPeriod: () => Promise<number>;
    getReminderStatus: (playerId: number, period: number) => Promise<boolean>;
    setRemiderStatus: (
        playerId: number,
        periodNumber: number,
        reminderSent: Date,
    ) => Promise<void>;
    setPostalRemiderStatus: (
        playerId: number,
        periodNumber: number,
        reminderSent: Date,
    ) => Promise<void>;
    getPlayersNextFixture: (
        playerId: number,
    ) => Promise<NextMatchSubmissionStatus | undefined>;
    getPlayerPredictions: (
        playerId: number,
        period: number,
    ) => Promise<PlayerPrediction[]>;
}

export interface MatchDatesForReminder {
    periodNumber: number;
    startDate: Date;
    playerId: number;
    chatId: string;
}

export interface MatchDatesForPostalReminder {
    periodNumber: number;
    startDate: Date;
    playerId: number;
    contactId: string;
    greeting: string;
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

export interface PlayerPrediction {
    game: number;
    homeTeam: string;
    awayTeam: string;
    home: number;
    away: number;
}
