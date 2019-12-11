import React, { Component } from 'react';

export default class Timeline extends Component {
	render(){
		const colour = "#DDD";

		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 20">
				<line fill="none" stroke={colour} strokeWidth="2" strokeMiterlimit="10" x1="0" y1="1.025" x2="800" y2="1.025"/>
				<line fill="none" stroke={colour} strokeWidth="2" strokeMiterlimit="10" x1="1" y1="0.025" x2="1" y2="10.025"/>
				<line fill="none" stroke={colour} strokeWidth="2" strokeMiterlimit="10" x1="799" y1="0.025" x2="799" y2="10.025"/>
				<line fill="none" stroke={colour} strokeWidth="2" strokeMiterlimit="10" x1="400" y1="0.025" x2="400" y2="10.025"/>
				<line fill="none" stroke={colour} strokeWidth="2" strokeMiterlimit="10" x1="200.5" y1="0.025" x2="200.5" y2="10.025"/>
				<line fill="none" stroke={colour} strokeWidth="2" strokeMiterlimit="10" x1="599.5" y1="0.025" x2="599.5" y2="10.025"/>
				<text transform="matrix(1 0 0 1 0 19.9746)" fill={colour} fontFamily="sans-serif" fontSize="12">00:00</text>
				<text transform="matrix(1 0 0 1 186.6665 19.9746)" fill={colour} fontFamily="sans-serif" fontSize="12">06:00</text>
				<text transform="matrix(1 0 0 1 387.333 19.9746)" fill={colour} fontFamily="sans-serif" fontSize="12">12:00</text>
				<text transform="matrix(1 0 0 1 585.9985 19.9746)" fill={colour} fontFamily="sans-serif" fontSize="12">18:00</text>
				<text transform="matrix(1 0 0 1 770 19.9746)" fill={colour} fontFamily="sans-serif" fontSize="12">00:00</text>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="34.25" y1="0.025" x2="34.25" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="67.5" y1="0.025" x2="67.5" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="100.75" y1="0.025" x2="100.75" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="134" y1="0.025" x2="134" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="167.25" y1="0.025" x2="167.25" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="233.75" y1="0.025" x2="233.75" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="267" y1="0.025" x2="267" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="300.25" y1="0.025" x2="300.25" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="333.5" y1="0.025" x2="333.5" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="366.75" y1="0.025" x2="366.75" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="433.25" y1="0.025" x2="433.25" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="466.5" y1="0.025" x2="466.5" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="499.75" y1="0.025" x2="499.75" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="533" y1="0.025" x2="533" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="566.25" y1="0.025" x2="566.25" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="632.75" y1="0.025" x2="632.75" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="666" y1="0.025" x2="666" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="699.25" y1="0.025" x2="699.25" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="732.5" y1="0.025" x2="732.5" y2="6.025"/>
				<line fill="none" stroke={colour} strokeMiterlimit="10" x1="765.75" y1="0.025" x2="765.75" y2="6.025"/>
			</svg>
		)
	}
}