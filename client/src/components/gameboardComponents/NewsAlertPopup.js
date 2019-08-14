import React from "react";
import PropTypes from "prop-types";

const newsAlertPopupStyle = {
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

const NewsAlertPopup = ({ newsAlert }) => {
	return (
		<div style={newsAlert.active ? newsAlertPopupStyle : invisibleStyle}>
			<div>NEWS ALERT!</div>
			<div>Title: {newsAlert.title}</div>
			<div>Info: {newsAlert.info}</div>
		</div>
	);
};

NewsAlertPopup.propTypes = {
	newsAlert: PropTypes.object.isRequired
};

export default NewsAlertPopup;
