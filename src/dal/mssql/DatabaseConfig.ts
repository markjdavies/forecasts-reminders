import { port } from 'znv';
import { z } from 'zod';

export const databaseConfigModel = z.object({
    host: z.string(),
    databaseName: z.string(),
    port: port().optional(),
    username: z.string(),
    password: z.string(),
});
export type DatabaseConfig = z.infer<typeof databaseConfigModel>;
