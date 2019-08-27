import React from "react";
import PropTypes from "prop-types";

const newsPopupStyle = {
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

const NewsAlertPopup = ({ news }) => {
	return (
		<div style={news.active ? newsPopupStyle : invisibleStyle}>
			<div>NEWS ALERT!</div>
			<div>Title: {news.newsTitle}</div>
			<div>Info: {news.newsInfo}</div>
		</div>
	);
};

NewsAlertPopup.propTypes = {
	news: PropTypes.object.isRequired
};

export default NewsAlertPopup;
