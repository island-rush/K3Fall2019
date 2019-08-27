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
		return <div style={true ? refuelPopupStyle : invisibleStyle}>Container Popup</div>;
	}
}

RefuelPopup.propTypes = {};

export default RefuelPopup;
