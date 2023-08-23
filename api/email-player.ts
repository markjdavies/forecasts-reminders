import { VercelRequest, VercelResponse } from '@vercel/node';
import { emailModel, mailer } from '../src/sendgrid/sendgrid';
import { config } from '../src/config';
// import { MssqlDataOperations } from '../src/dal/mssql/MssqlDataOperations';
// import { logger } from '../src/utils/logger';
import { Player } from '../src/dal/DataOperations';

const appConfig = config();
// const db = MssqlDataOperations(appConfig.db);
const { send } = mailer(appConfig);

const handler = async (
    req: VercelRequest,
    res: VercelResponse,
): Promise<void> => {
    if (req.method !== 'POST') {
        res.status(400).send('Please POST to this endpoint');
        return;
    }

    const { address } = req.query;

    const email = await emailModel.parse(req.body);

    // const player = await db.getPlayerById(Number(id));

    // const nextFixture = await db.getPlayersNextFixture(player.id);

    const player = { emailAddress: address, id: 0, name: '' } as Player;

    await send(player, email);

    res.send({ OK: true });
};

export default handler;
