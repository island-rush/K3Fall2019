import React, { Component } from "react";

const leftcontrolsStyle = {
	background: "grey",
	height: "80%",
	width: "25%",
	position: "relative",
	float: "left",
	margin: ".5%"
};

class Leftcontrols extends Component {
	render() {
		return (
			<div style={leftcontrolsStyle}>
				<div>Nothing Here</div>
				<div>Planning Controls</div>
			</div>
		);
	}
}

export default Leftcontrols;
