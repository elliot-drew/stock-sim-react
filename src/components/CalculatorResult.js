import React, {Component} from 'react';
import './Calculator.css';

export default class CalculatorResult extends Component {
    render() {
        let {result} = this.props;
        return (
            <div className="result">
                <p>{result}</p>
            </div>
    	);
    }
}