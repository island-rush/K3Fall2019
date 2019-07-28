import React, { Component } from "react";

export default class Maincontrol extends Component {
	maincontrolStyle = {
		backgroundColor: "grey",
		height: "80%",
		width: "20%",
		margin: ".5%",
		float: "left"
	};

	render() {
		return <div style={this.maincontrolStyle}>Main Control Button</div>;
	}
}
