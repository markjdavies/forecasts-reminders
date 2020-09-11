import { NowRequest, NowResponse } from '@vercel/node';
import { logger } from './utils/logger';

export const configurePing = (): ((
    req: NowRequest,
    res: NowResponse,
) => Promise<void>) => {
    const ping = async (_req: NowRequest, res: NowResponse): Promise<void> => {
        logger.info('ponging a ping');
        res.status(200).json('pong');
    };

    return ping;
};
