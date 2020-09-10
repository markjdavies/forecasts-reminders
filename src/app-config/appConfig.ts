import { ITelegramConfig } from '../TelegramConfig';
import { IDatabaseConfig } from '../dal/mssql/DatabaseConfig';
import { LoggerOptions } from 'pino';

export interface IAppConfig {
    telegram: ITelegramConfig;
    db: IDatabaseConfig;
    log: LoggerOptions;
    reminderService: IReminderServiceConfig;
    port?: 8000;
}

export interface IReminderServiceConfig {
    scoreEntryUrl: string;
    lookaheadDays: number;
    betaPlayers: number[];
    operatingHours: IOperatingHours;
}

export interface IOperatingHours {
    start: number;
    end: number;
}
