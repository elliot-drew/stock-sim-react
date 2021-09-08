/*
Adapted from https://medium.com/@nitinpatel_20236/how-to-build-a-simple-calculator-application-with-react-js-bc10a4568bbd


this will be totally siloed from the rest of app - no state or props going anywhere apart  from
ResultComponent and KeyPadComponent

*/


import React, { Component } from 'react';
import CalculatorResult from './CalculatorResult';
import CalculatorKeyPad from "./CalculatorKeyPad";

import './Calculator.css';

export default class Calculator extends Component {
    constructor(props){
        super(props); 

        this.state = {
            result: ""
        }
    }

    onClick = button => {

        if(button === "="){
            this.calculate()
        }

        else if(button === "C"){
            this.reset()
        }
        else if(button === "CE"){
            this.backspace()
        }

        else {
            this.setState({
                result: this.state.result + button
            })
        }
    };


    calculate = () => {
        try {
            this.setState({
                // eslint-disable-next-line
                result: (eval(this.state.result) || "" ) + ""
            })
        } catch (e) {
            this.setState({
                result: "error"
            })

        }
    };

    reset = () => {
        this.setState({
            result: ""
        })
    };

    backspace = () => {
        this.setState({
            result: this.state.result.slice(0, -1)
        })
    };

    render() {
        return (
            <div>
                <div className="calculator-body">
                    <CalculatorResult result={this.state.result}/>
                    <CalculatorKeyPad onClick={this.onClick}/>
                </div>
            </div>
        );
    }
}