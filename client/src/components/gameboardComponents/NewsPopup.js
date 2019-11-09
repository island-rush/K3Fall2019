import React from "react";
import { NEWS_POPUP_IMAGES } from "../styleConstants";
import PropTypes from "prop-types";

const newsPopupStyle = {
	backgroundColor: "white",
	width: "50%",
	height: "50%",
	top: "25%",
	right: "25%",
	position: "absolute"
};

const newsPopupMinimizeStyle = {
	position: "absolute",
	display: "block",
	width: "7%",
	height: "12%",
	top: "0%",
	left: "-8%",
	backgroundColor: "white",
	border: "2px solid black",
	zIndex: 4,
	backgroundSize: "100% 100%",
	backgroundRepeat: "no-repeat"
};

const isMinimizedStyle = {
	border: "2px solid red",
	top: "45%",
	margin: "2%"
};

const invisibleStyle = {
	display: "none"
};

const NewsAlertPopup = ({ news, newsPopupMinimizeToggle }) => {
	return (
		<div style={news.active ? null : invisibleStyle}>
			<div style={!news.isMinimized ? newsPopupStyle : invisibleStyle}>
				<div>NEWS ALERT!</div>
				<div>Title: {news.newsTitle}</div>
				<div>Info: {news.newsInfo}</div>
				<div
					onClick={event => {
						event.preventDefault();
						newsPopupMinimizeToggle();
						event.stopPropagation();
					}}
					style={{ ...newsPopupMinimizeStyle, ...NEWS_POPUP_IMAGES.minIcon }}
				/>
			</div>
			<div
				style={{ ...(news.isMinimized ? newsPopupMinimizeStyle : invisibleStyle), ...NEWS_POPUP_IMAGES.minIcon, ...isMinimizedStyle}}
				onClick={event => {
					event.preventDefault();
					newsPopupMinimizeToggle();
					event.stopPropagation();
				}}
			/>
		</div>
	);
};

NewsAlertPopup.propTypes = {
	news: PropTypes.object.isRequired,
	newsPopupMinimizeToggle: PropTypes.func.isRequired
};

export default NewsAlertPopup;
