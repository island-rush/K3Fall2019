import React, { Component } from "react";
import PropTypes from "prop-types";

const refuelPopupStyle = {
	backgroundColor: "white",
	width: "50%",
	height: "50%",
	top: "25%",
	right: "25%",
	position: "absolute"
};

const invisibleStyle = {
	display: "none"
};

class RefuelPopup extends Component {
	render() {
		const { refuel } = this.props;

		return <div style={refuel.active ? refuelPopupStyle : invisibleStyle}>Refuel Popup</div>;
	}
}

RefuelPopup.propTypes = {
	refuel: PropTypes.object.isRequired
};

export default RefuelPopup;
