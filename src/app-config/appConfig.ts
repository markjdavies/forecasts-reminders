import { z } from 'zod';
import { telegramConfigModel } from '../TelegramConfig';
import { postgridConfigModel } from '../PostgridConfig';
import { databaseConfigModel } from '../dal/mssql/DatabaseConfig';

export const logConfigModel = z.object({
    name: z.string().default('forecasts-reminder'),
    level: z
        .union([
            z.literal('fatal'),
            z.literal('error'),
            z.literal('warn'),
            z.literal('info'),
            z.literal('debug'),
            z.literal('trace'),
        ])
        .default('warn'),
});
export type LogConfig = z.infer<typeof logConfigModel>;

export const operatingHoursModel = z.object({
    start: z.number().int().default(19),
    end: z.number().int().default(22),
});
export type OperatingHours = z.infer<typeof operatingHoursModel>;

export const appConfigSchema = {
    telegram: telegramConfigModel,
    postgrid: postgridConfigModel,
    db: databaseConfigModel,
    log: logConfigModel,
    scoreEntryUrl: z
        .string()
        .default('https://forecasts.apphb.com/EnterScores/"'),
    lookaheadDays: z.number().int().default(2),
    lookaheadDaysPostal: z.number().int().default(7),
    operatingHours: operatingHoursModel,
};
export const appConfigModel = z.object(appConfigSchema);
export type AppConfig = z.infer<typeof appConfigModel>;
