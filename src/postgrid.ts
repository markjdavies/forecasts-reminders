import axios from 'axios';
import { Logger } from 'pino';
import { IPostgridConfig } from './PostgridConfig';

export interface IPostgridSender {
    send: (reminderWithScores: ReminderWithScores) => Promise<void>;
}

export type Prediction = {
    homeTeam: string;
    awayTeam: string;
    home: number;
    away: number;
};

export type ReminderWithScores = {
    contactId: string;
    greeting: string;
    matchSummary: string;
    predictions: Prediction[];
};

const mergePredictions = (predictions: Prediction[]) =>
    predictions.reduce((variables, p, i) => {
        variables[`home_team_${i - 1}`] = p.homeTeam;
        variables[`away_team_${i - 1}`] = p.awayTeam;
        variables[`home_${i - 1}`] = p.home;
        variables[`away_${i - 1}`] = p.away;
        return variables;
    }, {});

export const postgridWrapper = (
    config: IPostgridConfig,
    log: Logger,
): IPostgridSender => {
    const client = axios.create({
        baseURL: `${config.url}/`,
        headers: { 'x-api-key': `${config.apiKey}` },
    });

    return {
        send: async ({
            contactId,
            greeting,
            matchSummary,
            predictions,
        }: ReminderWithScores) => {
            log.info('');
            await client.post('postcards', {
                to: contactId,
                frontTemplate: config.frontTemplateId,
                backTemplate: config.backTemplateId,
                size: '6x4',
                mailingClass: 'standard_class',
                mergeVariables: {
                    ...mergePredictions(predictions),
                    username: greeting,
                    fixtureDescription: matchSummary,
                },
            });
        },
    };
};
