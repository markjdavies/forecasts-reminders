import axios from 'axios';
import { Logger } from 'pino';
import { PlayerPrediction } from './dal/DataOperations';
import { PostgridConfig } from './PostgridConfig';

export interface IPostgridSender {
    send: (reminderWithScores: ReminderWithScores) => Promise<void>;
}

export type ReminderWithScores = {
    contactId: string;
    greeting: string;
    matchSummary: string;
    predictions: PlayerPrediction[];
};

const mergePredictions = (predictions: PlayerPrediction[]) =>
    predictions.reduce((variables, p) => {
        variables[`home_team_${p.game}`] = p.homeTeam;
        variables[`away_team_${p.game}`] = p.awayTeam;
        variables[`home_${p.game}`] = p.home;
        variables[`away_${p.game}`] = p.away;
        return variables;
    }, {});

export const postgridWrapper = (
    config: PostgridConfig,
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
