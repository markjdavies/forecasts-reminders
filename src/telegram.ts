import axios from 'axios';
import { ITelegramConfig } from './TelegramConfig';
import { Logger } from 'pino';

export interface ITelegramSender {
    send: (chatId: string, message: string) => Promise<void>;
}

export const telegramWrapper = (
    config: ITelegramConfig,
    log: Logger,
): ITelegramSender => {
    const client = axios.create({
        baseURL: `${config.url}${config.botToken}/`,
    });

    return {
        send: async (chatId: string, message: string) => {
            log.info('');
            await client.post('sendMessage', {
                chat_id: chatId,
                text: message,
            });
        },
    };
};
