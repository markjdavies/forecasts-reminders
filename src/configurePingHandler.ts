import { NowRequest, NowResponse } from '@vercel/node';

export const configurePing = (): ((
    req: NowRequest,
    res: NowResponse,
) => Promise<void>) => {
    const ping = async (_req: NowRequest, res: NowResponse): Promise<void> => {
        res.status(200).json('pong');
    };

    return ping;
};
