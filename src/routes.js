import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';
import Joi from "joi";
import Rates from './models/rates.js';
import config from './config/index.js'

const routes = {
    name: 'ApiRoutes',
    register: async (server, options) => {
      server.route([
        {
            method: 'GET',
            path: '/',
            handler: async (request, h) => {

                return 'Its ok';
            }
        },
        {
            method: 'GET',
            path: '/getpairs',
            options: {
                description: 'Get pair',
                notes: 'Return array of pairs with original rates and new rates',
                tags: ['api'],
            },
            handler: async (request, h) => {

                /* Get Latest */
                const fetchedPairs = await Rates.find().sort({ createdAt : -1 }).limit(3);

                return fetchedPairs;
            }
        },
        {
            method: 'POST',
            path: '/createrates',
            options: {
                description: 'This endpoint fetch last rates from FX. And save in db all pairs info',
                notes: 'Return a succesfull message',
                tags: ['api'],
                validate: {
                    payload: Joi.object({
                        fee: Joi.number()
                        .description('To add a mark-up fee over the obtained FX rate.')
                    })
                }
            },
            handler: async (request, h) => {
                
                try {
                    
                    const fee = request.payload?.fee || 0;
    
                    const response  = await fetch(`${config.BASE_URL}/latest?access_key=${config.ACCESS_KEY}&symbols=USD,ARS,BRL`);
                    const body = await response.text();
                    const data = JSON.parse(body);
                    console.log(data)
    
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

                    return h.response({
                        msg: 'Rates created'
                    }).code(201);

                } catch(error) {
                    console.log(error)
                }
            }
        }
      ]);
    }
}

export default routes