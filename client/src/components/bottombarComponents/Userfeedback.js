import React from "react";
import PropTypes from "prop-types";

const userfeedbackStyle = {
	background: "grey",
	height: "80%",
	width: "40%",
	position: "relative",
	float: "left",
	margin: ".5%"
};

const Userfeedback = ({ userFeedback }) => {
	return <div style={userfeedbackStyle}>{userFeedback}</div>;
};

Userfeedback.propTypes = {
	userFeedback: PropTypes.string.isRequired
};

export default Userfeedback;
