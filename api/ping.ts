import { NowRequest, NowResponse } from '@vercel/node';

const ping = async (_req: NowRequest, res: NowResponse): Promise<void> => {
    res.status(200).json('acknowledged');
};

export default ping;
