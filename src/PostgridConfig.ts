import { z } from 'zod';

export const postgridConfigModel = z.object({
    url: z.string().url().default('https://api.postgrid.com/print-mail/v1/'),
    apiKey: z.string(),
    frontTemplateId: z.string(),
    backTemplateId: z.string(),
    backTemplateEmptyId: z.string().default('template_s9gbsUSKh9J8Z9T222TE5v'),
});
export type PostgridConfig = z.infer<typeof postgridConfigModel>;
