import { default as Config } from 'config';

if (process.env['NODE_ENV'] !== 'local') {
    const configPath = `${__dirname}/../config/`;
    process.env['NODE_CONFIG_DIR'] = configPath;
}

export default Config;
