import Hapi from '@hapi/hapi';

import './database.js';
import routes from './routes.js'

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(routes);
    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.route([
        {
            method: 'GET',
            path: '/',
            handler: async (request, h) => {

                return 'Its ok';
            }
        },
    ])
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();