import React, { Component } from "react";
import PropTypes from "prop-types";

const containerPopupStyle = {
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

class ContainerPopup extends Component {
	render() {
		return <div style={true ? containerPopupStyle : invisibleStyle}>Container Popup</div>;
	}
}

ContainerPopup.propTypes = {};

export default ContainerPopup;
