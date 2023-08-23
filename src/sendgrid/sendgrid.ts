import sgMail from '@sendgrid/mail';
import { Player } from '../dal/DataOperations';
import { AppConfig } from '../app-config/appConfig';
import { z } from "zod";

export const emailModel = z.object({
    subject: z.string(),
    plainText: z.string(),
    html: z.string(),
});

export type Email = z.infer<typeof emailModel>;

export const mailer = (config: AppConfig) => {
    sgMail.setApiKey(config.sendgridApiKey);
    return {
        send: async (player: Player, message: Email) => {

            const msg = {
                to: player.emailAddress,
                from: config.fromAddress,
                subject: message.subject,
                text: message.plainText,
                html: message.html,
            };

            await sgMail.send(msg);
        }
    }
}
