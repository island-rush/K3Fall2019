import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { zoomboxBackgrounds } from "../constants";
import Piece from "./Piece";

const zoomboxStyle = {
	position: "absolute",
	left: "0%",
	bottom: "0%",
	height: "29%",
	width: "26%"
};

const invisibleStyle = {
	display: "none"
};

class Zoombox extends Component {
	render() {
		const isVisible = this.props.selectedPos !== -1;

		const pieces = !isVisible
			? null
			: this.props.gameboard[this.props.selectedPos].pieces.map(
					(piece, index) => <Piece key={index} piece={piece} />
			  );

		return (
			<div
				style={
					isVisible
						? {
								...zoomboxStyle,
								...zoomboxBackgrounds[
									this.props.gameboard[this.props.selectedPos].type
								]
						  }
						: invisibleStyle
				}
				onClick={event => {
					event.preventDefault();
					event.stopPropagation();
				}}
			>
				{pieces}
			</div>
		);
	}
}

Zoombox.propTypes = {
	selectedPos: PropTypes.number.isRequired,
	gameboard: PropTypes.object.isRequired
};

const mapStateToProps = ({ gameboard, gameboardMeta }) => ({
	selectedPos: gameboardMeta.selectedPosition,
	gameboard: gameboard
});

const mapActionsToProps = {};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Zoombox);
