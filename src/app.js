import Hapi from '@hapi/hapi';

import './database.js';
import routes from './routes.js'

const init = async () => {

    const server = Hapi.server({
        port: 3000,
    });

    await server.register(routes);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();