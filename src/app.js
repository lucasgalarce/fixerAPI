import Hapi from '@hapi/hapi';
import fetch from 'node-fetch';
import './database.js';
import { v4 as uuidv4 } from 'uuid';
import Rates from './models/rates.js';


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
    
    server.route({
        method: 'GET',
        path: '/createrates',
        handler: async (request, h) => {

            try {

                const response  = await fetch(`http://data.fixer.io/api/latest?access_key=824e753b9d8f1bf170e5adf80e7788e9&symbols=USD,ARS,BRL`);
                const body = await response.text();
                const data = JSON.parse(body);

                const rateId = uuidv4();
    
                const newRates = new Rates({
                    id: rateId,
                    timestamp: data.timestamp,
                    base: data.base,
                    date: data.date,
                    originalRates: data.rates,
                    fee: 5,
                });
        
                const saveRates = await newRates.save();
                console.log(saveRates)

                // res.status(200).json({
                //     Response: true,
                //     Message: 'Rates created.',
                // });
                return 'ok'
            } catch(error) {
                console.log(error)
            }

        }
    });
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();