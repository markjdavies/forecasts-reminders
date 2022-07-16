import { ITelegramConfig } from '../TelegramConfig';
import { IDatabaseConfig } from '../dal/mssql/DatabaseConfig';
import { LoggerOptions } from 'pino';
import { IPostgridConfig } from '../PostgridConfig';

export interface IAppConfig {
    telegram: ITelegramConfig;
    postgrid: IPostgridConfig;
    db: IDatabaseConfig;
    log: LoggerOptions;
    reminderService: IReminderServiceConfig;
    port?: 8000;
}

export interface IReminderServiceConfig {
    scoreEntryUrl: string;
    lookaheadDays: number;
    lookaheadDaysPostal: number;
    operatingHours: IOperatingHours;
}

export interface IOperatingHours {
    start: number;
    end: number;
}
