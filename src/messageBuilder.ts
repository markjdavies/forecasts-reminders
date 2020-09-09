import { NextMatchSubmissionStatus } from './dal/DataOperations';
import { Logger } from 'pino';
import { format } from 'fecha';

export type MessageBuilder = (
    fixtureDetails: NextMatchSubmissionStatus,
) => string;

export const messageBuilder = (
    log: Logger,
    enterScoresUrl: string,
): MessageBuilder => {
    return (fixtureDetails: NextMatchSubmissionStatus): string => {
        const homeOrAway = fixtureDetails.awayTeam ? 'H' : 'A';
        const formattedDate = format(fixtureDetails.date, 'ddd Do MMM');
        const opponent = fixtureDetails.homeTeam
            ? fixtureDetails.homeTeam
            : fixtureDetails.awayTeam;
        const prompt = fixtureDetails.submissionTime
            ? `You have already submitted scores, but you can still refine them here: ${enterScoresUrl}`
            : `Don't forget to enter your scores here: ${enterScoresUrl}`;

        const message = `Your next match is: (${homeOrAway}) ${formattedDate} (${fixtureDetails.roundName}) v ${opponent}. ${prompt}`;
        log.info('Prepared message', { message, fixtureDetails });
        return message;
    };
};
