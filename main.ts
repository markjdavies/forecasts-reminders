import { createServer } from 'vercel-node-server';
import * as Config from 'config';
import { configureReminderHandler } from './src/configureReminderHandler';

const reminder = configureReminderHandler();
const server = createServer(reminder);

server.listen(Config.get<number>('port'));