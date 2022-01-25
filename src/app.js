import Hapi from '@hapi/hapi';

import './database.js';
import routes from './routes.js'

/* Swagger */
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

const init = async () => {

    const server = Hapi.server({
        port: 3000,
    });

    /* Swagger */
    const swaggerOptions = {
        info: {
            title: 'Backend dev challenge API Documentation',
        }
    };

    await server.register([
        routes,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();