const request = require('request');
const crypto = require('crypto');
const baseURL = 'https://api.coindcx.com';
import { resolve } from 'bun';
import {key, secret} from './config';

export const createOrder = (side: 'buy' | 'sell', market : string, price: number, quantity: number, clientOrderId: string ) => {

    return new Promise<void>((resolve, reject) => {
        const body = {
            side,
            "order_type": "limit_order", //Toggle between a 'market_order' or 'limit_order'.
            market,
            "price_per_unit": price,
            "total_quantity": quantity, //Replace this with the quantity you want
            "timestamp": Math.floor(Date.now()), //This is the current timestamp in milliseconds.
            "client_order_id": clientOrderId
          }
          
        
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex'); 
    
        const options = {    
            url: baseURL + "exchange/v1/wallets/transfer",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
    
        request.post(options, (err: any, res: any, body: any) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log(body);
            resolve();
        }); 
    
    })

}

export const cancelOrder = () => {

}

export const cancelAll = (market: string) => {

    return new Promise<void>((resolve) => {
        const body = {
            market, 
            timestamp:  Math.floor(Date.now()),
        }
        
        const payload = new Buffer(JSON.stringify(body)).toString();
        const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')
        
        const options = {
            url: baseURL + "/exchange/v1/orders/cancel_all",
            headers: {
                'X-AUTH-APIKEY': key,
                'X-AUTH-SIGNATURE': signature
            },
            json: true,
            body: body
        }
        
        request.post(options, function(error: any, response: any, body: any) {
            console.log(body);
            resolve();
        })
    })
}