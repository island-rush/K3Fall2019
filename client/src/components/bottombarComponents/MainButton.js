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
		const buttonText = this.props.gameInfo.gameStatus
			? "Waiting"
			: "Main Button";

		return (
			<div style={mainButtonStyle} onClick={() => this.props.mainButtonClick()}>
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
