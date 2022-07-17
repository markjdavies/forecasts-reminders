import axios from 'axios';
import { ITelegramConfig } from './TelegramConfig';
import { Logger } from 'pino';
import { ConfirmationMessage } from './messageBuilder';

export interface ITelegramSender {
    send: (chatId: string, message: ConfirmationMessage) => Promise<void>;
}

export const telegramWrapper = (
    config: ITelegramConfig,
    log: Logger,
): ITelegramSender => {
    const client = axios.create({
        baseURL: `${config.url}${config.botToken}/`,
    });

    return {
        send: async (
            chatId: string,
            { matchSummary, prompt }: ConfirmationMessage,
        ) => {
            log.info('');
            await client.post('sendMessage', {
                chat_id: chatId,
                text: `${matchSummary} ${prompt}`,
            });
        },
    };
};
