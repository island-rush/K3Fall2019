import React, { Component } from "react";
import PropTypes from "prop-types";

const mainButtonStyle = {
	backgroundColor: "grey",
	height: "80%",
	width: "20%",
	margin: ".5%",
	float: "left"
};

class MainButton extends Component {
	render() {
		const { mainButtonClick, gameInfo } = this.props;
		const { gameStatus, gamePhase, gameSlice } = gameInfo;

		//TODO: clean this mess up
		let buttonText;
		if (gameStatus === 1) {
			buttonText = "Waiting on other Team...";
		} else {
			if (gamePhase === 0) {
				buttonText = "Click to go to Purchase";
			} else if (gamePhase === 1) {
				buttonText = "Click to go to Combat";
			} else if (gamePhase === 2) {
				if (gameSlice === 0) {
					buttonText = "Click to end Planning";
				} else {
					buttonText = "Click to execute step.";
				}
			} else if (gamePhase === 3) {
				buttonText = "Click to go to News";
			} else {
				buttonText = "Loading...";
			}
		}

		return (
			<div
				style={mainButtonStyle}
				onClick={event => {
					// normally confirms are obtrusive UI, and should use something else TODO: confirm dialog box...
					// eslint-disable-next-line no-restricted-globals
					// if (confirm("Are you sure you want to move on?")) {
					// 	this.props.mainButtonClick();
					// }
					event.preventDefault();
					mainButtonClick();
					event.stopPropagation();
				}}
			>
				{buttonText}
			</div>
		);
	}
}

MainButton.propTypes = {
	mainButtonClick: PropTypes.func.isRequired,
	gameInfo: PropTypes.object.isRequired
};

export default MainButton;
