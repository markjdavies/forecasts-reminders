import { z } from 'zod';

export const telegramConfigModel = z.object({
    url: z.string().url().default('https://api.telegram.org/bot'),
    botToken: z.string(),
});
export type TelegramConfig = z.infer<typeof telegramConfigModel>;
