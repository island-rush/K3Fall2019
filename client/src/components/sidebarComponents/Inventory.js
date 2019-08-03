import React, { Component } from "react";
import PropTypes from "prop-types";

class Inventory extends Component {
	inventoryStyle = {
		backgroundColor: "Yellow",
		position: "absolute",
		height: "120%",
		width: "1800%",
		marginLeft: "150%",
		marginTop: "20%"
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

Inventory.propTypes = {
	selected: PropTypes.bool.isRequired
};

export default Inventory;
