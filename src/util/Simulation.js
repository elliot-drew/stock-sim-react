/*
Functions to produce fake stock prices
*/

import normSinv from './normsinv'


function randomStart(){
	let currentPrice = 1+Math.random()*10; // number between 10 and 20
	let meanChange = 0.0001; // 
	let stdChange = 0.01;

	if(meanChange===0){
		meanChange=0.10;
	}
	if(stdChange===0){
		stdChange=0.05;
	}
	
	return([currentPrice, meanChange, stdChange]);
}

function projectPrice(currentPrice, meanPrice, meanChange, stdChange){

	const drift = meanChange - (stdChange * stdChange) / 2;
	const randomShock = stdChange * normSinv(Math.random());

    currentPrice = currentPrice * Math.exp(drift + randomShock);

    // pulls value back to mean
    const meanReversion = currentPrice*((1-meanPrice/currentPrice))*Math.random()*0.01;
	
    return currentPrice - meanReversion;
}

function average(arr){
    let total = 0;
    
    if(arr.length>0){
        for(let i=0;i<arr.length;i++){
            total+=arr[i];
        }
        return(total/arr.length);
    }else{
        return(0);
    }
    

}

function std(arr) {
  const n = arr.length
  if(n===0){
    return 0
  }
  else{
    const mean = average(arr)
    return Math.sqrt(arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
  }
  
}

function periodReturn(y, t){
    return(((t-y)/y))
}


function trade(signal, balance, currentPrice, fee){
    /*
    signal is whether buying, selling or nothing.
    balance is current account balance.
    fee is placeholder right now - 
    */
    switch(signal){
        case(1):
            balance=balance-currentPrice;
            break
        case(-1):
            balance=balance+currentPrice;
            break
        case(0):
            break
    }

    return(balance)
}

function step(stepNum, periodPrices, currentPrice, returnHistory, priceHistory){

    let meanChange = average(returnHistory.slice(900)); 
    let stdChange = std(returnHistory.slice(900));
    /*let meanChange = 0.000001; // 
    let stdChange = 0.00005;*/

    let tmpPrice = projectPrice(currentPrice, average(priceHistory), meanChange, stdChange)
    
    stepNum+=1;

    periodPrices.push(tmpPrice)

    let data = {
        "x": stepNum,
        "o": periodPrices[0],
        "l": Math.min(...periodPrices),
        "h": Math.max(...periodPrices),
        "c": periodPrices.slice(-1)[0],
    }

    return([data, stepNum, periodPrices, meanChange, stdChange])
}	

function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function SMA(priceHistory, i, range){
    // we do this one step at a time in step()
    let tmpPeriod = priceHistory.slice(i-range, i);
    
    return(average(tmpPeriod))
}

function generateHistory(pl){

    let [currentPrice, meanChange, stdChange] = randomStart();

    /*meanChange = 0.00001
    stdChange = 0.005*/
    
    //console.log(meanChange, stdChange)
    


    let data = {}
    let stepNum = 0
    let periodPrices = []
    let rndweight = Math.random();

    let returnHistory = Array.from({length: 1000}, () => (randn_bm()*stdChange+meanChange));
    let priceHistory = []
    let reverseReturns = returnHistory.slice().reverse()
    let oldprice;

    for(let i=0; i<reverseReturns.length;i++){
        oldprice = currentPrice/(1+reverseReturns[i]);
        priceHistory.push(oldprice);
    }

    priceHistory.reverse();


    let periodHistory = [['period', "last bought", 'SMA50','SMA25','SMA5', 'l', 'o', 'c', 'h']];
    let p=0
    
    for(let i=0;i<60*pl;i++){
        
        [data, stepNum, periodPrices, meanChange, stdChange] = step(stepNum, periodPrices, currentPrice, returnHistory, priceHistory);
        
        currentPrice = data.c;

        
        if((i+1) % pl === 0){

            let change = periodReturn(periodPrices.slice(-2,-1),data.c)
            returnHistory.push(change)
            if(returnHistory.length>1000){
                returnHistory.shift()    
            }
            priceHistory.push(data.c)

            let sma5 = SMA(priceHistory, priceHistory.length-1, 5)
            let sma25 = SMA(priceHistory, priceHistory.length-1, 25)
            let sma50 = SMA(priceHistory, priceHistory.length-1, 50)
            
            p++;
            periodHistory.push([
                p,
                data.c,
                sma50,
                sma25,
                sma5,
                data.l,
                data.o,
                data.c,
                data.h,
                
              ])
            
            periodPrices=[];
        }
        
    }
    //periodHistory.push([0,0,0,0,0,0,0,0])
    return([data, periodHistory, returnHistory, stepNum, p, priceHistory])
}

export {step, randomStart, periodReturn, generateHistory, randn_bm, SMA, average};
