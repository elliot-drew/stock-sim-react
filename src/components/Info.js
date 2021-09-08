import React from 'react';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';



export default class Info extends React.Component {

	constructor(props) {
		super(props);
	}

	periodReturn(y, t){
	    return(((t-y)/y))
	}

	render() {

		let currentPrice = this.props.priceHistory[this.props.priceHistory.length-1]
		let prevPrice = this.props.priceHistory[this.props.priceHistory.length-40]

		let dreturn = this.periodReturn(prevPrice, currentPrice);

		console.log(prevPrice, currentPrice, dreturn)
		
		let profit = (this.props.balance+this.props.ownedShares*currentPrice)-1000
		let profitpc = 1- (1000/(this.props.balance+this.props.ownedShares*currentPrice))

		let profCol;
		
		if(profit<0){
			profCol = "red";
		}
		else if(profit>0){
			profCol = "#1fa61d";
		}else{
			profCol = "white";
		}

		let returnCol;
		let arrow;
		
		if(dreturn<0){
			returnCol = "red";
			arrow = <i class='bi bi-caret-down-fill'></i>
		}
		else if(dreturn>0){
			returnCol = "#1fa61d";
			arrow = <i class='bi bi-caret-up-fill'></i>
		}else{
			returnCol = "white";
			arrow = <i class='bi bi-grip-horizontal'></i>
		}

		return (
			<div style={{width:"350px"}}>
				
				<span style={{fontSize:"2em"}}>{this.props.stockName} </span>
				<span style={{fontSize:"1.8em"}}>§{(Math.round(currentPrice*10000)/10000).toFixed(4)}  </span>
				<span style={{fontSize:"1.3em", color:returnCol}}>{arrow}{(Math.round(dreturn*100000)/100000).toFixed(5)}%</span>
				<Table hover variant="dark"
				style={{fontSize:"small"}}
				>
				<tbody>
					<tr>
						<td>CASH</td>
						<td>§{this.props.balance}</td>
					</tr>
					<tr>
						<td>OWNED</td>
						<td>{this.props.ownedShares}</td>
					</tr>
					<tr>
						<td>VALUE</td>
						<td>§{Math.round(currentPrice*this.props.ownedShares*10000)/10000}</td>
					</tr>
					<tr>
						<td>PROFIT</td>
						<td
						style={{color:profCol}}
						>§{(Math.round(profit*10000)/10000).toFixed(4)} ({(profitpc*100).toFixed(4)}%)</td>
					</tr>
				</tbody>
				</Table>

			</div>
		);
	}
}
