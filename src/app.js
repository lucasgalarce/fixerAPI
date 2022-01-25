import Hapi from '@hapi/hapi';
import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

import './database.js';
import Rates from './models/rates.js';
import config from './config/index.js'


const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
    
    server.route({
        method: 'POST',
        path: '/createrates',
        handler: async (request, h) => {
            
            try {
                
                const fee = request.payload?.fee || 0;

                const response  = await fetch(`${config.BASE_URL}/latest?access_key=${config.ACCESS_KEY}&symbols=USD,ARS,BRL`);
                const body = await response.text();
                const data = JSON.parse(body);

                const eurRateId = uuidv4();

                data.newRates = {};
                const usdRates = {}
                const usdNewRates = {};
                const brlRates = {}
                const brlNewRates = {};
                
                /* Get fee param and calculate new rates */
                Object.entries(data.rates).forEach(([key, value]) => {

                    /* New rates for EUR (rate + fee) */
                    data.newRates[key] = data.rates[key] + (value * fee)/100;

                    /* Rates for USD */
                    if(key !== "USD") {

                        usdRates[key] = data.rates[key]/ data.rates['USD'];

                        /* New rates for USD (rate + fee) */
                        usdNewRates[key] = usdRates[key] + (usdRates[key] * fee)/100;

                    } 
                    
                    if(key !== "BRL" && key !== "USD") {

                        brlRates[key] = data.rates[key]/ data.rates['BRL'];

                        /* New rates for BRL (rate + fee) */
                        brlNewRates[key] = brlRates[key] + (brlRates[key] * fee)/100;
                    }

                });

                const newEurRates = new Rates({
                    id: eurRateId,
                    timestamp: data.timestamp,
                    base: data.base,
                    date: data.date,
                    originalRates: data.rates,
                    newRates: data.newRates,
                    fee,
                });
        
                const saveEurRates = await newEurRates.save();

                const usdRateId = uuidv4();

                const newUsdRates = new Rates({
                    id: usdRateId,
                    timestamp: data.timestamp,
                    base: 'USD',
                    date: data.date,
                    originalRates: usdRates,
                    newRates: usdNewRates,
                    fee,
                });
        
                const saveUsdRates = await newUsdRates.save();

                const brlRateId = uuidv4();

                const newBrlRates = new Rates({
                    id: brlRateId,
                    timestamp: data.timestamp,
                    base: 'BRL',
                    date: data.date,
                    originalRates: brlRates,
                    newRates: brlNewRates,
                    fee,
                });
        
                const saveBrlRates = await newBrlRates.save();

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