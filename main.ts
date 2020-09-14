import { createServer } from 'vercel-node-server';
import { default as Config } from 'config';
import { configureReminderHandler } from './src/configureReminderHandler';

const reminder = configureReminderHandler();
const server = createServer(reminder);

server.listen(Config.get<number>('app.port'));
