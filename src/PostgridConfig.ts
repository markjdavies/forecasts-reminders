import { z } from 'zod';

export const postgridConfigModel = z.object({
    url: z.string().url().default('https://api.postgrid.com/print-mail/v1/'),
    apiKey: z.string(),
    frontTemplateId: z.string(),
    backTemplateId: z.string(),
});
export type PostgridConfig = z.infer<typeof postgridConfigModel>;
