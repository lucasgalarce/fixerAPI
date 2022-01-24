import Hapi from '@hapi/hapi';
import fetch from 'node-fetch';
import './database.js';

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
    
    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {

            const response  = await fetch(`http://data.fixer.io/api/latest?access_key=824e753b9d8f1bf170e5adf80e7788e9&symbols=USD,ARS,BRL`);
            const body = await response.text();
            console.log(body)
            return 'Hello World!';
        }
    });
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();