import React, { Component } from "react";
import PropTypes from "prop-types";

const userfeedbackStyle = {
	background: "grey",
	height: "80%",
	width: "40%",
	position: "relative",
	float: "left",
	margin: ".5%"
};

class Userfeedback extends Component {
	render() {
		return <div style={userfeedbackStyle}>{this.props.userFeedback}</div>;
	}
}

Userfeedback.propTypes = {
	userFeedback: PropTypes.string.isRequired
};

export default Userfeedback;
