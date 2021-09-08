import React, {Component} from 'react';
import './Calculator.css';

import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap'

export default class CalculatorKeyPad extends Component {

    render() {
        return (
            <div>
                <ButtonGroup>
                <Button className="calculator-buttons" name="1" onClick={e => this.props.onClick(e.target.name)}>1</Button>
                <Button className="calculator-buttons" name="2" onClick={e => this.props.onClick(e.target.name)}>2</Button>
                <Button className="calculator-buttons" name="3" onClick={e => this.props.onClick(e.target.name)}>3</Button>
                <Button className="calculator-buttons" name="(" onClick={e => this.props.onClick(e.target.name)}>(</Button>
                <Button className="calculator-buttons" name="+" onClick={e => this.props.onClick(e.target.name)}>+</Button>
                <Button className="calculator-buttons" name="CE" onClick={e => this.props.onClick(e.target.name)}>CE</Button>
                <Button variant="danger" className="calculator-buttons" name="C" onClick={e => this.props.onClick(e.target.name)}>C</Button>
                </ButtonGroup>
                <br/>
                <ButtonGroup>
                <Button className="calculator-buttons" name="4" onClick={e => this.props.onClick(e.target.name)}>4</Button>
                <Button className="calculator-buttons" name="5" onClick={e => this.props.onClick(e.target.name)}>5</Button>
                <Button className="calculator-buttons" name="6" onClick={e => this.props.onClick(e.target.name)}>6</Button>
                <Button className="calculator-buttons" name=")" onClick={e => this.props.onClick(e.target.name)}>)</Button>
                <Button className="calculator-buttons" name="-" onClick={e => this.props.onClick(e.target.name)}>-</Button>
                <Button className="calculator-buttons" name="*" onClick={e => this.props.onClick(e.target.name)}>x</Button>
                <Button className="calculator-buttons" name="/" onClick={e => this.props.onClick(e.target.name)}>÷</Button>
                </ButtonGroup>
                <br/>
                <ButtonGroup>
                <Button className="calculator-buttons" name="7" onClick={e => this.props.onClick(e.target.name)}>7</Button>
                <Button className="calculator-buttons" name="8" onClick={e => this.props.onClick(e.target.name)}>8</Button>
                <Button className="calculator-buttons" name="9" onClick={e => this.props.onClick(e.target.name)}>9</Button>
                <Button className="calculator-buttons" name="0" onClick={e => this.props.onClick(e.target.name)}>0</Button>
                <Button className="calculator-buttons" name="." onClick={e => this.props.onClick(e.target.name)}>.</Button>
                <Button variant="success" className="equals-button" name="=" onClick={e => this.props.onClick(e.target.name)}>=</Button>
                </ButtonGroup>
                <br/>    
            </div>
        );
    }
}

