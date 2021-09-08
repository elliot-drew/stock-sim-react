import React from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {InputGroup, FormControl, Form} from 'react-bootstrap'

import Calculator from  '../components/Calculator.js'

import 'bootstrap-icons/font/bootstrap-icons.css';

export default class Ui extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div
			style={{width:"350px"}}
			>
	
			<ButtonToolbar>
			 <ButtonGroup
			 className="fifty-group-first" 
			 >
			  <Button
              onClick={() => this.props.stepperStart()}
              variant="success"
              >
              <i class="bi bi-play-fill"></i>
              </Button>
              <Button
              onClick={() => this.props.stepperPause()}
              variant="danger"
              >
              <i class="bi bi-pause-fill"></i>
              </Button>
              <Button
              onClick={() => this.props.stepperReset()}
              >
              <i class="bi bi-arrow-repeat"></i>
              </Button>
             </ButtonGroup>
             <ButtonGroup
             className="fifty-group-second" 
             >
             	<Button
             	onClick={() => this.props.buy()}
             	>
             		BUY
             	</Button>
             	<Button
             	onClick={() => this.props.sell()}
             	>
             		SELL
             	</Button>

             </ButtonGroup>
            </ButtonToolbar>
            <br/>
            <InputGroup className="mb-3">
			    <InputGroup.Text id="Amount1">Amount</InputGroup.Text>
			    <FormControl
            onChange = {e => this.props.amountChange(e.target.value)}
			      defaultValue = {this.props.amount}
			      aria-label="Amount"
			      aria-describedby="Amount1"
			    />
			    </InputGroup>
          <Form.Label>Number of Periods: {this.props.visiblePeriods}</Form.Label>
          <Form.Range  
          defaultValue={this.props.visiblePeriods} step={"1"} min={"10"} max={"60"}
          onChange={e => this.props.visiblePeriodsChange(e.target.value)}
          />
            <Calculator/>
    
			</div>
		);
	}
}


