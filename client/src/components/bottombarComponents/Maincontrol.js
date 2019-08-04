import React, { Component } from "react";

const maincontrolStyle = {
	backgroundColor: "grey",
	height: "80%",
	width: "20%",
	margin: ".5%",
	float: "left"
};

class Maincontrol extends Component {
	render() {
		return <div style={maincontrolStyle}>Main Control Button</div>;
	}
}

export default Maincontrol;
