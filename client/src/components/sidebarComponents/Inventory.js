import React, { Component } from "react";

class Inventory extends Component {
	inventoryStyle = {
		backgroundColor: "Yellow",
		height: "100%",
		width: "70%"
	};

	invisibleStyle = {
		display: "none"
	};

	render() {
		return (
			<div
				style={this.props.selected ? this.inventoryStyle : this.invisibleStyle}
			>
				Inventory
			</div>
		);
	}
}

export default Inventory;
