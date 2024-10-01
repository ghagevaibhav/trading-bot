import axios from "axios";
import { DepthManager } from "./DepthManager";
import { cancelAll, createOrder } from "./order";

const solINRMarket = new DepthManager('B-XAI_INR')

const usdtINRMarket = new DepthManager('B-USDT_INR')

const solUSDTMarket = new DepthManager('B-XAI_USDT')

setInterval(() => {
    console.log('SOL-INR', solINRMarket.getRelevantDepth())
    console.log('USDT-INR', usdtINRMarket.getRelevantDepth())
    console.log('SOL-USDT', solUSDTMarket.getRelevantDepth())

    // there are two sides you can trade on
    // sell SOL for INR, buy USDT from INR , buy SOL from INR
    // let's start with 1 SOL 

    const canGetINR = solINRMarket.getRelevantDepth().lowestAsk - 0.001;
    const canGetUSDT = canGetINR / usdtINRMarket.getRelevantDepth().lowestAsk;
    const canGetSol = canGetUSDT / solUSDTMarket.getRelevantDepth().lowestAsk;

    console.log(`you can convert ${1} SOL to ${canGetSol} SOLS`)


    // second strategy
    // buy sol for inr , sell sol for usdt , sell usdt for inr 
    const initialINR = solINRMarket.getRelevantDepth().highestBid + 0.001;
    const canGetUSDT2 = solUSDTMarket.getRelevantDepth().highestBid ;
    const canGetINR2 = canGetUSDT2 *  usdtINRMarket.getRelevantDepth().highestBid;
    console.log(`you can convert ${initialINR} INR to ${canGetINR2} INR`)

}, 2000)

async function main(){
    const highestBid = solINRMarket.getRelevantDepth().highestBid;
    await createOrder('buy', 'XAIINR', parseFloat((highestBid + 0.01).toFixed(3)), 10, Math.random().toString());
    await new Promise((r) => setTimeout(r, 10000));
    await cancelAll('XAIINR')
    await new Promise((r) => setTimeout(r, 1000));
    main();
}

setTimeout(() => {
    main();
}, 2000);