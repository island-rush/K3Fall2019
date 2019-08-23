import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { zoomboxBackgrounds } from "../constants";
import Piece from "./Piece";
import {
	selectPiece,
	clearPieceSelection
} from "../../redux/actions/userActions";

const zoomboxStyle = {
	position: "absolute",
	left: "0%",
	bottom: "0%",
	height: "29%",
	width: "24%",
	boxShadow: "0px 0px 0px 2px rgba(0, 0, 0, 1) inset"
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
					(piece, index) => (
						<Piece
							pieceClick={this.props.selectPiece}
							selected={this.props.selectedPiece === piece.pieceId}
							topLevel={true}
							key={index}
							piece={piece}
						/>
					)
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
					//close current selected piece?
					//close any open pieces
					this.props.clearPieceSelection();
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
	gameboard: PropTypes.array.isRequired
};

const mapStateToProps = ({ gameboard, gameboardMeta }) => ({
	selectedPos: gameboardMeta.selectedPosition,
	selectedPiece: gameboardMeta.selectedPiece,
	gameboard: gameboard
});

const mapActionsToProps = {
	selectPiece: selectPiece,
	clearPieceSelection: clearPieceSelection
};

export default connect(
	mapStateToProps,
	mapActionsToProps
)(Zoombox);
