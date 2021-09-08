import logo from './logo.svg';
import './App.css';
import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Button, Navbar } from 'react-bootstrap'

import NavHeader from './components/NavHeader';
import Ui from './components/ui.js';
import Info from './components/Info.js';

import Chart from 'react-google-charts';

import { randomStart, step, periodReturn, generateHistory, randn_bm, SMA, average } from './util/Simulation.js';




var tick;

/*google.visualization.events.addListener(annotatedtimeline , 
         'rangechange',function() {
          console.log("hello")
         });*/

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.amountChange=this.amountChange.bind(this);
    this.visiblePeriodsChange=this.visiblePeriodsChange.bind(this);
    
    this.state = {
      brand: "StockSim",
      meanChange: 0,
      stdChange: 0,
      stepNum:1,
      periodPrices:[],
      periodData: {
        "o":10,
        "h":10,
        "l":10,
        "c":10,
        },
      currentPrice:10,
      returnHistory: Array.from({length: 1000}, () => (randn_bm()*0+0)),
      periodLength:50, // 
      period:0,
      periodHistory:[['period', "last bought", 'SMA50','SMA25','SMA5', 'l', 'o', 'c', 'h']],
      priceHistory:[],
      //UI stuff
      stockName:this.stockNameGen(),
      buySell: 0, // -1 to sell, 0 to wait, 1 to buy 
                   // will be able to modify for multiples later.
      lastBuy: 0, //last price bought
      lastSell: 0, //last price sold
      firstBuy:false, // has anything been bought yet
      ownedShares: 0,
      balance:1000,
      buyHistory:[],
      amount:100,
      visiblePeriods:40,
      speed:200,
    };
  }

  stockNameGen(){
    let rude = ["FUCK", "CUNT", "SHIT", "DICK"];  // sorry i know
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let charactersLength = characters.length;
    for ( let i = 0; i < 4; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if(rude.includes(result)){
      result = this.stockNameGen();
    }
    return result;
    }

  sell(){
    console.log()
    this.setState({buySell: -this.state.amount});
  }

  buy(){
    console.log()
    this.setState({buySell: this.state.amount});
  }

  amountChange(a){
    console.log(a);
    this.setState({amount: parseInt(a)});
  }

  speedChange(a){
    console.log(a);
    this.setState({speed: parseInt(a)});
  }

  visiblePeriodsChange(a){
    console.log(a)
    this.setState({visiblePeriods:parseInt(a)});
  }

 
  stepper(){
    tick = setInterval(() => {



      var [data, stepNum, periodPrices, meanChange, stdChange] = step(
                                                                this.state.stepNum, 
                                                                this.state.periodPrices, 
                                                                this.state.currentPrice,
                                                                this.state.returnHistory,
                                                                this.state.priceHistory,
                                                                )

      
      
      const returnHistory = this.state.returnHistory;
      var p = this.state.period;
      const periodHistory  = this.state.periodHistory;
      const priceHistory  = this.state.priceHistory;
      
      priceHistory.pop()

      if(this.state.buySell>0){
        let tmpCost = data.c*this.state.buySell;
        let tmpCount = this.state.buySell;
        // dont go into debt
        if(tmpCost>this.state.balance){
          // find factor
          tmpCount = Math.floor(this.state.balance/data.c);
          tmpCost = data.c * tmpCount;
        }
        this.setState({
          lastBuy: data.c, 
          firstBuy:true, 
          ownedShares:this.state.ownedShares+tmpCount,
          balance: this.state.balance - tmpCost,
          buyHistory: this.state.buyHistory.concat(Array(this.state.buySell).fill(data.c))
        });
      }else if(this.state.buySell<0){
        if(this.state.ownedShares-1>=0){
          let newBuyHistory = this.state.buyHistory;

          let tmpBuySell = this.state.buySell;

          //make sure we dont sell more than we have
          if(0-this.state.buySell>=this.state.ownedShares){
            tmpBuySell = - this.state.ownedShares;
            newBuyHistory=[];
          }
          this.setState({ 
            ownedShares:this.state.ownedShares+(1*tmpBuySell),
            balance: this.state.balance + (-data.c*tmpBuySell),
            buyHistory: newBuyHistory,
          });
        }
        
      }

      console.log(this.state.buyHistory);

      var avBuy=data.c;

      if(this.state.buyHistory.length>0){
        avBuy = average(this.state.buyHistory);
      }
      

      if(this.state.firstBuy === false){
        this.setState({lastBuy: data.c});
      }

      for(let i=1; i<periodHistory.length;i++){
        periodHistory[i][1]=avBuy;
      }


      if(p>61){
        periodHistory.pop() // remove the current period stick, to be readded (possible p end too)
      }
      if(this.state.stepNum % this.state.periodLength == 0){
        let change = periodReturn(periodPrices.slice(-2,-1),data.c)
        returnHistory.push(change)

        priceHistory.push(data.c)
        
        let sma5 = SMA(priceHistory, priceHistory.length-1, 5)
        let sma25 = SMA(priceHistory, priceHistory.length-1, 25)
        let sma50 = SMA(priceHistory, priceHistory.length-1, 50)
        //empty out periodPrices and data after storing data stuff in periodHistory
        //periodHistory - data in format easy for Charts
        periodHistory.push([
            p,
            avBuy,
            sma50,
            sma25,
            sma5,
            data.l,
            data.o,
            data.c,
            data.h,
            
          ])
        periodHistory.splice(1,1) // remove first

        //increment the period
        p++
        periodPrices=[data.c]
        data={
          "x":stepNum,
          "o":data.c,
          "h":data.c,
          "l":data.c,
          "c":data.c,
        }



        this.setState({
          periodPrices:periodPrices,
          periodHistory:periodHistory,
          period:p,
        })
      }

      // these are what get popped above - provides animations
      priceHistory.push(data.c) 

      let sma5 = SMA(priceHistory, priceHistory.length-1, 5)
      let sma25 = SMA(priceHistory, priceHistory.length-1, 25)
      let sma50 = SMA(priceHistory, priceHistory.length-1, 50)

      periodHistory.push([
            p,
            avBuy,
            sma50,
            sma25,
            sma5,
            data.l,
            data.o,
            data.c,
            data.h,
            
          ])

      

      if(returnHistory.length>1000){
        returnHistory.shift();
      }

      if(priceHistory.length>1000){
        priceHistory.shift();
      }
      

      this.setState({
        currentPrice: data.c,
        meanChange: meanChange,
        stdChange: stdChange,
        stepNum:stepNum,
        periodPrices:periodPrices,
        periodData: data,
        returnHistory: returnHistory,
        priceHistory: priceHistory,
        buySell:0,
      })
    },this.state.speed);
  }



  componentDidMount() {
    this.stepperReset();

  }
  
  stepperStart(){
    this.stepper();
  }

  stepperPause(){
    clearInterval(tick);
  }

  stepperReset(){
    clearInterval(tick);
    let [d, ph, rh, sn, p, prh] = generateHistory(this.state.periodLength);
    
    this.setState({
      meanChange: 0,
      stdChange: 0,
      stepNum:sn+1,
      periodPrices:[],
      periodData:d,
      currentPrice:d.c,
      returnHistory:rh,
      periodLength:10, // 1 minute
      period:p+1,
      periodHistory:ph,
      priceHistory:prh,
      buySell:0,
      ownedShares:0,
      stockName:this.stockNameGen(),
      buySell: 0, // -1 to sell, 0 to wait, 1 to buy 
      lastBuy: 0, //last price bought
      lastSell: 0, //last price sold
      firstBuy:false, // has anything been bought yet
      ownedShares: 0,
      balance:1000,
      buyHistory:[],
    })
  }

  render(){

    let buyWidth=0.0;
    
    if(this.state.buyHistory.length>0){
      buyWidth=1.0
    }else{
      buyWidth=0.0
    }
    
    return (
      <div>
        <NavHeader
        name = { this.state.brand }
        ></NavHeader>
        <Container>
          <Row >
            <Col 
            sm={12} 
            md={6}
            lg
            //lg={"auto"}
            >
              <Chart
                width={'100%'}
                height={650}
                chartType="ComboChart"
                loader={<div>Loading Chart</div>}
                data={this.state.periodHistory}
                options={{
                  //legend: 'none',
                  bar: { groupWidth: '80%' }, // Remove space between bars.
                  seriesType: "candlesticks",
                  backgroundColor: {
                    fill: '#FF0000',
                    fillOpacity: 0
                  },
                  hAxis: {
                    viewWindow: {
                        min: this.state.period-this.state.visiblePeriods,
                        max: this.state.period+5
                    },
                    gridlines: {color: '#1E4D6B'},
                    minorGridlines: {color: '#133952'},
                  },
                  vAxis: {
                    
                    gridlines: {color: '#1E4D6B'},
                    minorGridlines: {color: '#133952'},
                  },
                  chartArea: {
                    width:'90%',
                    height:'80%',
                    backgroundColor:{
                      fill:"#2b2922",
                      fillOpacity:0,
                    },
                    
                  },
                  legend:{position: 'top', textStyle: {color: 'green', fontSize: 16}},
                  candlestick: {
                    fallingColor: { strokeWidth: 0.5, fill: '#a52714',stroke: 'grey' }, // red
                    risingColor: { strokeWidth: 0.5, fill: '#0f9d58', stroke: 'grey' }   // green
                  },
                  //colors:['#0f9d58'],
                  series:{
                    0:{type:'line', lineWidth:buyWidth, color:"white"},
                    1:{type:'line', color:"magenta"},
                    2:{type:'line', color:"orange"},
                    3:{type:'line', color:"cyan"},
                    4:{
                      visibleInLegend:false,
                      color:'grey',
                      lineWidth:0.5,
                    }
                  },
                  

                }}
                rootProps={{ 'data-testid': '1' }}
              />
            </Col>
            <Col sm={12} md={6} lg={"auto"}>
                <Info
                stockName = {this.state.stockName}
                balance = {this.state.balance}
                ownedShares = {this.state.ownedShares}
                priceHistory ={this.state.priceHistory}

                />
                <Ui
                stepperStart={() => this.stepperStart()}
                stepperPause={() => this.stepperPause()}
                stepperReset={() => this.stepperReset()}
                sell={() => this.sell()}
                buy={() => this.buy()}
                amountChange={this.amountChange}
                amount = {this.state.amount}
                visiblePeriodsChange={this.visiblePeriodsChange}
                visiblePeriods = {this.state.visiblePeriods}
                />
            </Col>
          </Row>
        </Container>
        <footer>
          <div 
          className="footer"
          >
          {Date()}
          </div>
        </footer>
      </div>
    );
  }
}

