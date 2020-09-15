import { NowRequest, NowResponse } from '@vercel/node';

const ping = async (_req: NowRequest, res: NowResponse): Promise<void> => {
    const configPath = __dirname + '/config/';
    res.status(200).json({ configPath });
};

export default ping;
