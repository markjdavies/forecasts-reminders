import { IAppConfig } from './app-config/appConfig';

export const config = (): IAppConfig => ({
    telegram: JSON.parse(process.env.telegram ?? ''),
    postgrid: JSON.parse(process.env.postgrid ?? ''),
    db: JSON.parse(process.env.db ?? ''),
    log: JSON.parse(process.env.log ?? ''),
    reminderService: {
        scoreEntryUrl:
            process.env.scoreEntryUrl ??
            'https://forecasts.apphb.com/EnterScores/',
        lookaheadDays: parseInt(process.env.lookaheadDays ?? '2', 10),
        lookaheadDaysPostal: parseInt(
            process.env.lookaheadDaysPostal ?? '2',
            10,
        ),
        operatingHours: JSON.parse(process.env.operatingHours ?? ''),
    },
});
